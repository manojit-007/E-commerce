import crypto from "crypto";
import Product from "../data_models/productModels.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import generateUniqueSlug from "../middleware/generateUniqueSlugs.js";
import responseHandler from "../utils/responseHandler.js";
import socketEvent from "../utils/socketEvent.js";
import cloudinary from "../utils/cloudinarySetUp.js";
import { CustomError } from "../middleware/errorHandler.js";
import validateId from "../middleware/mongoDbIdValidate.js";
import mongoose from "mongoose";

// Get All Products Without Filters - admin
const allProducts = catchAsyncError(async (req, res, next) => {
  // console.log(req.user);
  const products = await Product.find()
    // .select("-__v") // exclude the __v field
    // .populate("seller", "name email"); // populate the seller field with specific fields

  // Log the products data to inspect it
  // console.log("Fetched products:", products);

  // Send the response back
  responseHandler(res, 200, "All products fetched successfully.", { products });

  // Log again after response
  // console.log("Products sent in response:", products);
});

// admin own listed products
const adminListedProducts = catchAsyncError(async (req, res, next) => {
  const id = req.user.id;
  const products = await Product.find({ seller: id }).select("-__v");
  if (!products || products.length === 0) {
    return responseHandler(res, 404, "No products found for this admin.");
    
  }
  responseHandler(res, 200, "Products fetched successfully.", {
    products: products,
  });
});

// Create Product Handler - seller + admin
const createProduct = catchAsyncError(async (req, res, next) => {
  const { name, price, description, category, quantity, image } = req.body;

  if (
    !name ||
    !price ||
    !description ||
    !category ||
    !quantity ||
    !image ||
    image.length === 0
  ) {
    return responseHandler(
      res,
      400,
      "All fields are required, including at least one image."
    );
  }

  // Generate unique slug
  let slug = await generateUniqueSlug(name);
  const exists = await Product.exists({ slug });
  if (exists) {
    slug = `${slug}-${crypto.randomBytes(4).toString("hex")}`;
  }

  // Create and save the product
  const product = await Product.create({
    name,
    slug,
    price,
    description,
    category,
    quantity,
    image,
    seller: req.user.id, // Assuming the logged-in user is the seller
  });

  responseHandler(res, 201, "Product created successfully.", { product });
});

//seller
const sellerListedProducts = catchAsyncError(async (req, res, next) => {
  const id = req.user.id;
  const products = await Product.find({ seller: id }).select("-__v");
  responseHandler(res, 200, "Products fetched successfully.", {
    products: products,
  });
});

const deleteProductById = catchAsyncError(async (req, res, next) => {
  const { productId } = req.params;
  // console.log(productId);
  if (!productId) {
    return responseHandler(res, 400, "Product ID is required.");
  }

  const product = await Product.findById(productId);

  if (!product) {
    return responseHandler(res, 404, "Product not found.");
  }
  // console.log(req.user);
  // Check if the user is the seller of the product or an admin
  if (
    product.seller.toString() !== req.user.id.toString() &&
    req.user.role !== "admin"
  ) {
    return responseHandler(
      res,
      403,
      "You are not authorized to delete this product."
    );
  }

  // Delete the product image from Cloudinary if it exists
  if (product.image?.publicId) {
    await cloudinary.uploader.destroy(product.image.publicId);
  }

  await Product.findByIdAndDelete(productId);
  responseHandler(res, 200, "Product deleted successfully.", { productId });
});

// Get Product by ID - seller + admin
const getProductById = catchAsyncError(async (req, res, next) => {
  const { productId } = req.params;


  // Fetch the product
  const product = await Product.findById(productId);
  if (!product) {
    return responseHandler(res, 404, "Product not found.");
  }

  // Respond with the product
  return responseHandler(res, 200, "Product fetched successfully.", { product });
});

// Update Product - seller + admin
const updateProduct = (io) =>
  catchAsyncError(async (req, res, next) => {
    const { productId } = req.params;

    // Validate the product ID
    try {
      validateId(productId); // Assumes this throws an error if invalid
    } catch (error) {
      return responseHandler(res, 400, error.message || "Invalid Product ID.");
    }

    // Find the product by ID
    const product = await Product.findById(productId);
    // console.log("before update", product);
    if (!product) {
      return responseHandler(res, 404, "Product not found.");
    }

    const allowedUpdates = [
      "name",
      "description",
      "price",
      "quantity",
      "image",
      "category",
    ];
    const updates = req.body;

    // console.log("1", updates.image?.publicId, req.body.image?.publicId);
    // Check if the image needs to be updated
    if (
      updates.image?.publicId &&
      product.image?.publicId &&
      updates.image.publicId !== product.image.publicId
    ) {
      try {
        // Delete the previous image using its publicId
        await cloudinary.uploader.destroy(product.image.publicId);
      } catch (err) {
        console.error("Failed to delete the previous image:", err);
        return responseHandler(res, 500, "Failed to delete the old image.");
      }
    }

    // Update only allowed fields
    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        product[key] = updates[key];
      }
    });

    // Save the updated product
    try {
      let product2 = await product.save();
      // console.log("after update", product2);
    } catch (err) {
      console.error("Error saving updated product:", err);
      return responseHandler(res, 500, "Failed to update the product.");
    }

    // Emit product update via socket.io
    socketEvent(io, "productUpdate", {
      id: product._id,
      ...product.toObject(),
    });

    // Respond with success
    return responseHandler(res, 200, "Product updated successfully.", {
      product,
    });
  });

//  USER
// Get All Products with Filters, Sorting, and Pagination
const getAllProducts = catchAsyncError(async (req, res, next) => {
  const {
    category,
    search,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 10,
  } = req.query;

  const query = {};
  if (category) query.category = category;
  if (search) query.name = new RegExp(search.replace(/-/g, " "), "i");
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const pageNumber = Number(page);
  const perPage = Number(limit);
  const skip = (pageNumber - 1) * perPage;

  let sortOption = {};
  if (sort === "price_asc") sortOption.price = 1;
  if (sort === "price_desc") sortOption.price = -1;
  if (sort === "newest") sortOption.createdAt = -1;

  const products = await Product.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(perPage)
    .select("name price category image quantity description createdAt seller");

  const productCount = await Product.countDocuments(query);

  responseHandler(res, 200, "Products fetched successfully.", {
    productCount,
    totalPages: Math.ceil(productCount / perPage),
    currentPage: pageNumber,
    products,
  });
});

//add review

const productReview = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;
  const { productId, orderId, username, rating, comment } = req.body;
  // console.log(productId, orderId, username, rating, comment,userId);
  const review = {
    user: userId,
    orderId,
    username,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  if (!product) {
    return res
      .status(404)
      .json({ message: "Product not found", success: false });
  }

  const isReviewed = product.reviews.find(
    (rev) => rev.orderId.toString() === orderId.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.orderId.toString() === orderId.toString()) {
        rev.rating = review.rating;
        rev.comment = review.comment;
      }
    });
    await product.save();
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  // Calculate average rating
  const totalRating = product.reviews.reduce((acc, rev) => acc + rev.rating, 0);
  product.ratings = totalRating / product.reviews.length;

  await product.save();
  return responseHandler(res, 200, "Review submitted successfully.", {
    product,
  });
});

export {
  createProduct,
  adminListedProducts,
  getAllProducts,
  allProducts,
  getProductById,
  updateProduct,
  sellerListedProducts,
  deleteProductById,
  productReview
};
