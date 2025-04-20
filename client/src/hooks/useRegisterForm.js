// src/hooks/useRegisterForm.js
import { useState } from "react";
import checkPassword from "@/utils/validateFields";
import { checkName } from "@/utils/checkName";

export const useRegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const isFormValid = () => {
    const { name, email, password, confirmPassword } = formData;
    if (!checkName(name)) return "Name must contain only letters (A-Z, a-z).";
    if (!email) return "Email is required.";
    if (!checkPassword(password))
      return "Password must be 8-40 characters, include uppercase, lowercase, number, special character, and no spaces.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return true;
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleRoleChange,
    isFormValid,
  };
};