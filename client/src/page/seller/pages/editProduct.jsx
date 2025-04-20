/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteImageById, fileUpload } from "@/utils/imageHandler";
import { toastMessage } from "@/utils/tostMessage";
import {
  deleteProduct,
  getProductDetails,
  updateProduct,
} from "@/redux-store/product/productThunkFunctions";
import Loader from "@/utils/loader";
import ErrorComponent from "@/utils/errorComponents";
import Title from "@/components/reusableComponents/title";
import Note from "@/components/reusableComponents/note";

const FormField = ({ label, id, value, onChange, type = "text", options }) => (
  <div className="w-full flex flex-col gap-2">
    <Label htmlFor={id}>{label}</Label>
    {type === "select" ? (
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
      >
        <option value="" disabled>
          Select a {label.toLowerCase()}
        </option>
        {options.map((option) => (
          <option key={option} value={option.toLowerCase()}>
            {option}
          </option>
        ))}
      </select>
    ) : (
      <Input id={id} type={type} value={value} onChange={onChange} />
    )}
  </div>
);

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const fileRef = useRef();

  const { productDetails, loading, error } = useSelector((state) => state.product);

  const initialState = {
    name: "",
    price: "",
    category: "",
    quantity: "",
    description: "",
    image: { publicId: "", imageUrl: "" },
  };

  const [formData, setFormData] = useState(initialState);
  const [newImage, setNewImage] = useState({ publicId: "", imageUrl: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ["Electronics", "Clothing", "Accessories", "Home"];

  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (productDetails && productDetails._id === id) {
      setFormData({
        ...initialState,
        ...productDetails,
        image: productDetails.image || initialState.image,
      });
    }
  }, [productDetails, id]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { public_id: publicId, url: imageUrl } = await fileUpload(file);
      setNewImage({ publicId, imageUrl });
      fileRef.current.value = ""; // Reset file input
      toastMessage("success", "Image uploaded successfully.");
    } catch (err) {
      toastMessage("error", err.message || "Failed to upload image.");
    }
  };

  const handleDeleteImage = async () => {
    try {
      if (newImage.publicId) {
        await deleteImageById(newImage.publicId);
        setNewImage({ publicId: "", imageUrl: "" });
        toastMessage("success", "Image deleted successfully.");
      }
    } catch (err) {
      toastMessage("error", err.message || "Failed to delete image.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const finalImage = newImage.imageUrl ? newImage : formData.image;

    try {
      const response = await dispatch(
        updateProduct({
          productId: id,
          productData: { ...formData, image: finalImage },
        })
      ).unwrap();
      toastMessage("success", response.message || "Product updated successfully.");
      navigate("/seller/products");
    } catch (err) {
      toastMessage("error", err.message || "Failed to update product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await dispatch(deleteProduct({ productId: id })).unwrap();
      toastMessage("success", "Product deleted successfully.");
      navigate("/seller/products");
    } catch (err) {
      toastMessage("error", err.message || "Failed to delete product.");
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorComponent error={error} />;

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center p-4">
      <Title title={id ? `Edit Product - ${id}` : "Edit Product"} />

      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <Note note="Please ensure all fields are filled out correctly before submitting. We don't store any information during update." />
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col items-center gap-4 mt-2 w-full max-w-md"
      >
        <FormField
          label="Name"
          id="name"
          value={formData.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
        />
        <FormField
          label="Price"
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => handleFieldChange("price", e.target.value)}
        />
        <FormField
          label="Category"
          id="category"
          type="select"
          value={formData.category}
          onChange={(e) => handleFieldChange("category", e.target.value)}
          options={categories}
        />
        <FormField
          label="Quantity"
          id="quantity"
          type="number"
          value={formData.quantity}
          onChange={(e) => handleFieldChange("quantity", e.target.value)}
        />
        <FormField
          label="Description"
          id="description"
          value={formData.description}
          onChange={(e) => handleFieldChange("description", e.target.value)}
        />
        <div className="w-full flex items-center justify-between">
          <img
            src={
              newImage.imageUrl || formData.image.imageUrl || "/placeholder.png"
            }
            alt="Product Preview"
            className="w-32 h-32 object-contain border"
          />
        </div>
        <Input
          type="file"
          ref={fileRef}
          onChange={handleImageUpload}
          accept="image/*"
        />
        {newImage.imageUrl && (
          <Button type="button" onClick={handleDeleteImage}>
            Delete Uploaded Image
          </Button>
        )}
        <Button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
      <Button
        onClick={handleDeleteProduct}
        className="bg-red-500 text-white px-4 py-2 rounded mt-4"
      >
        Delete Product
      </Button>
    </section>
  );
};

export default EditProduct;
