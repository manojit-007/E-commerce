import apiClient from "@/apiClient/apiClient";
import { toastMessage } from "./tostMessage";

// Upload Image
const fileUpload = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await apiClient.post("/image/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    // // console.log("Upload successful:", response.data);
    toastMessage("success", "Upload successfully.");
    return response.data;
  } catch (error) {
    // console.error("Error uploading image:", error);
    toastMessage("error", "Please provide valid credentials.");
    throw error;
  }
};

// Delete Image
const deleteImageById = async (public_id) => {
  // console.log("public_id", public_id);
  try {
    const response = await apiClient.delete("/image/delete", {
      data: { public_id },
    });
    // // console.log(response);
    toastMessage("success", "Image delete successfully.");
    // // console.log("Deletion successful:", response.data);
    return response.data;
  } catch (error) {
    // console.error("Error deleting image:", error);
    toastMessage("error", error.message);
    throw error;
  }
};

export { fileUpload, deleteImageById };
