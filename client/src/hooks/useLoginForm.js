// src/hooks/useLoginForm.js
import { useState } from "react";
import checkPassword from "@/utils/validateFields";

export const useLoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    const { email, password } = formData;
    return email && checkPassword(password);
  };

  const isFormValid = () => validateFields();

  return {
    ...formData,
    handleChange,
    isFormValid,
    validateFields,
  };
};
