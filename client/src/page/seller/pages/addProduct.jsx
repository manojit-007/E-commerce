import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useProductFormValidation } from "@/hooks/useProductForm";
import { toastMessage } from "@/utils/tostMessage";
import { Trash, Loader } from "lucide-react";
import { deleteImageById, fileUpload } from "@/utils/imageHandler";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "@/redux-store/product/productThunkFunctions";
import { categories } from "@/data/data";


const AddProduct = () => {
  const dispatch = useDispatch();
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    quantity: "",
    image: {
      publicId: "",
      imageUrl: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const { name } = useSelector((state) => state.auth.user);
  const memoizedName = useMemo(() => {
    return name;
  }, [name]);
  const fileInputRef = useRef(null);

  const { errors, validate } = useProductFormValidation({
    name: { required: true },
    price: { required: true, min: 1 },
    category: { required: true },
    description: { required: true },
    quantity: { required: true, min: 1 },
    image: {
      required: true,
      validate: (image) =>
        !image.publicId || !image.imageUrl
          ? "Image with publicId and imageUrl is required."
          : null,
    },
  });

  useEffect(() => {
    const savedData = localStorage.getItem("productData");
    if (savedData) {
      setProductData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("productData", JSON.stringify(productData));
  }, [productData]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleImageUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const { public_id: publicId, url: imageUrl } = await fileUpload(file);
      setProductData((prev) => ({
        ...prev,
        image: { publicId, imageUrl },
      }));
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toastMessage("error", error.message || "Image upload failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteImage = useCallback(async () => {
    if (!productData.image.publicId) return;

    setLoading(true);
    try {
      await deleteImageById(productData.image.publicId);
      setProductData((prev) => ({
        ...prev,
        image: { publicId: "", imageUrl: "" },
      }));
    } catch (error) {
      toastMessage("error", error.message || "Failed to delete image.");
    } finally {
      setLoading(false);
    }
  }, [productData.image]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate(productData)) return;

    setLoading(true);
    try {
      const response = dispatch(createProduct(productData));
      // console.log(response);
      toastMessage(
        "success",
        response.message || "Product added successfully!"
      );
      setProductData({
        name: "",
        price: "",
        category: "",
        description: "",
        quantity: "",
        image: { publicId: "", imageUrl: "" },
      });
      localStorage.removeItem("productData");
    } catch (error) {
      toastMessage(
        "error",
        error.response?.data?.message || "Failed to add product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-screen flex items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit}
        className="bg-transparent p-6 w-full max-w-lg"
      >
        <p className="text-center mb-4 text-sm text-gray-600">
          Welcome, {memoizedName}!
        </p>
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Add a New Product
        </h2>

        {Object.entries(productData).map(([key, value]) => (
          <div key={key} className="mb-4">
            <Label htmlFor={key} className="mb-2 block capitalize text-sm">
              {key === "image" ? "Product Image" : key}
            </Label>

            {key === "category" ? (
              <select
                name={key}
                id={key}
                value={value}
                onChange={handleInputChange}
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
            ) : key === "description" ? (
              <textarea
                name={key}
                id={key}
                value={value}
                onChange={handleInputChange}
                rows={3}
                className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            ) : key === "image" ? (
              <>
                {!productData?.image?.imageUrl && (
                  <Input
                    type="file"
                    id={key}
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    accept="image/*"
                    className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  />
                )}
                {productData.image.imageUrl && (
                  <div className="flex items-center mt-2 gap-4">
                    <img
                      src={productData.image.imageUrl}
                      alt="Product"
                      className="w-24 h-24 rounded border object-contain"
                    />
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={handleDeleteImage}
                      className="text-red-500 border duration-300 hover:bg-red-500 hover:text-white"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Input
                type={key === "price" || key === "quantity" ? "number" : "text"}
                id={key}
                name={key}
                value={value}
                onChange={handleInputChange}
                className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            )}

            {errors[key] && (
              <p className="text-red-500 text-sm mt-1">{errors[key]}</p>
            )}
          </div>
        ))}

        <Button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white transition-colors duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? (
            <Loader className="animate-spin mx-auto" />
          ) : (
            "Add Product"
          )}
        </Button>
      </form>
    </section>
  );
};

export default AddProduct;
