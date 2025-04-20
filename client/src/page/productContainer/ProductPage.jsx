import { getProductDetails } from "@/redux-store/product/productThunkFunctions";
import ProductCardLoader from "@/utils/productCardLoader";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import NotFound from "../errorContainer/NotFound";
import { Button } from "@/components/ui/button";
import { toastMessage } from "@/utils/tostMessage";

const socket = io(import.meta.env.VITE_API_BASE_URL, { autoConnect: true });

const ProductPage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productDetails, loading, error } = useSelector((state) => state.product);

  const [localProductDetails, setLocalProductDetails] = useState(productDetails);

  const addToCart = (product) => {
    console.log(product);
    const { name, image, price, _id: productId, } = product;
    //destructuring the product object for backend
    const item = {
      name,
      image: image?.imageUrl || "/placeholder.jpg",
      price,
      quantity: 1,
      product: productId,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = existingCart.find(
      (cartItem) => cartItem.product === productId
    );

    if (existingProduct) {
      const newQuantity = existingProduct.quantity + 1;
      existingProduct.quantity = newQuantity;
    } else {
      existingCart.push(item);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    toastMessage("success","Product added to cart!");
  };

  useEffect(() => {
    dispatch(getProductDetails(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    setLocalProductDetails(productDetails);
  }, [productDetails]);

  useEffect(() => {
    const handleProductUpdate = (updatedProduct) => {
      if (updatedProduct.id === productId) setLocalProductDetails(updatedProduct);
    };

    socket.on("productUpdate", handleProductUpdate);

    return () => {
      socket.off("productUpdate", handleProductUpdate);
    };
  }, [productId]);

  if (loading) return <ProductCardLoader />;
  if (error) return <NotFound message={error} />;

  const { name, description, image, price, quantity, reviews,ratings } = localProductDetails || {};

  return (
    <section className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      <Button className="absolute top-4 left-4 bg-blue-600 text-white hover:bg-blue-700" onClick={() => navigate(-1)}>
        Back
      </Button>
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center">
        <div className="flex-shrink-0 w-full md:w-1/2">
          <img
            src={image?.imageUrl || "/placeholder.png"}
            alt={name || "Product"}
            className="w-full h-64 object-contain rounded-lg"
          />
        </div>
        <div className="mt-4 md:mt-0 md:ml-6 flex-1">
          <h1 className="text-3xl font-bold text-gray-800">{name || "Product Name Not Available"}</h1>
          <p className="text-gray-600 text-sm mb-4">
              <span className="text-sm text-gray-600 mb-4 mr-2">
                {ratings ? (
                  <span className="text-yellow-500 font-bold">
                    {ratings} ★
                  </span>
                ) : (
                  "0 ★"
                )}
              </span>
              {productDetails?.numOfReviews || "0"} Reviews
            </p>
          <p className="text-gray-600 mt-2">{description || "No description available."}</p>
          <p className="text-xl font-semibold text-gray-800 mt-4">Price: ₹{price || "N/A"}</p>
          <p className="text-gray-600 mt-2">Available Quantity: {quantity || 0}</p>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700 mt-4"
            onClick={() => addToCart(localProductDetails)}
          >
            Add to Cart
          </Button>
        </div>
      </div>

      <div className="w-full max-w-4xl mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviews</h2>
        {reviews?.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg bg-white shadow-sm">
              <p className="text-gray-600">{review.comment}</p>
              <p className="text-sm text-gray-500">
                - {review.user.name} ({review.rating}/5)
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No reviews available for this product.</p>
        )}
      </div>
    </section>
  );
};

export default ProductPage;
