import React, { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getProductDetails,
  updateProduct,
} from "@/redux-store/seller/sellerThunkFunctions";
import { deleteImageById, fileUpload } from "@/utils/imageHandler";
import { toastMessage } from "@/utils/tostMessage";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  if (!id) {
    navigate("/seller/notFound");
  }
  const categories = ["Electronics", "Clothing", "Accessories", "Home"];

  const fileRef = useRef();
  const dispatch = useDispatch();

  const [newImage, setNewImage] = useState({ publicId: "", imageUrl: "" });
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    quantity: "",
    description: "",
    image: { publicId: "", imageUrl: "" },
  });

  const { productDetails, loading, error } = useSelector(
    (state) => state.seller
  );

  // Fetch product details
  useEffect(() => {
    if (id) dispatch(getProductDetails(id));
  }, [id, dispatch]);

  // Update form data when product details change
  useEffect(() => {
    if (productDetails) {
      setFormData({
        name: productDetails.name || "",
        price: productDetails.price || "",
        category: productDetails.category || "",
        quantity: productDetails.quantity || "",
        description: productDetails.description || "",
        image: productDetails.image || { publicId: "", imageUrl: "" },
      });
    }
  }, [productDetails]);

  // Handle image upload
  const handleImageUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { public_id: publicId, url: imageUrl } = await fileUpload(file);
      setNewImage({ publicId: publicId || "", imageUrl: imageUrl || "" });
      if (fileRef.current) fileRef.current.value = "";
      toastMessage("success", "Image uploaded successfully.");
    } catch (error) {
      toastMessage("error", error.message || "Image upload failed.");
    }
  }, []);

  // Delete uploaded image
  const deleteUploadImage = async () => {
    try {
      await deleteImageById(newImage.publicId);
      setNewImage({ publicId: "", imageUrl: "" });
      toastMessage("success", "Image deleted successfully.");
    } catch (error) {
      toastMessage("error", error.message || "Failed to delete image.");
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const updatedImage = newImage.imageUrl ? newImage : formData.image;

    const payload = {
      productId: id,
      productData: { ...formData, image: updatedImage },
    };

    try {
      const response = await dispatch(updateProduct(payload)).unwrap();
      toastMessage(
        "success",
        response.message || "Product updated successfully."
      );
      navigate("/seller/products");
    } catch (err) {
      toastMessage("error", err.message || "Failed to update product.");
    } finally {
      setNewImage({ publicId: "", imageUrl: "" });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message || "An error occurred"}</div>;

  return (
    <section className="w-full h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col items-center justify-center gap-4 w-full max-w-md"
      >
        <div className="w-full flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <Label htmlFor="category">Category</Label>
          <select
            value={formData.category}
            onChange={
              (e) => setFormData({ ...formData, category: e.target.value }) // Correctly updates category
            }
            className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat.toLowerCase()}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full flex flex-col gap-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        {formData.image.imageUrl && (
          <section className="flex items-center justify-between w-full border">
          <div className="w-1/2 flex flex-col flex-1 gap-2 items-center">
            <Label>Current Image</Label>
            <img
              src={formData.image.imageUrl}
              alt="Old Product"
              className="w-32 h-32 object-contain"
              />
          </div>
          {newImage.imageUrl && 
          <div className="w-1/2 flex flex-col gap-2 border items-center">
            <Label>Current Image</Label>
            <img
              src={newImage.imageUrl}
              alt="Old Product"
              className="w-32 h-32 object-contain"
              />
          </div>
            }
              </section>
        )}

        {!newImage.imageUrl ? (
          <Input
            type="file"
            ref={fileRef}
            onChange={handleImageUpload}
            accept="image/*"
          />
        ) : (
          <div className="w-full flex flex-col items-center gap-2">
            <Button
              type="button"
              onClick={deleteUploadImage}
              className="text-red-500 bg-white px-3 py-1 border rounded hover:bg-red-500 hover:text-white"
            >
              Delete New Image
            </Button>
          </div>
        )}
        <Button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          Save Changes
        </Button>
      </form>
    </section>
  );
};

export default EditProduct;

save form data and newImage save to local storage