import { useState } from "react";

export const useProductFormValidation = (rules) => {
  const [errors, setErrors] = useState({});

  const validate = (data) => {
    const newErrors = {};
    Object.entries(rules).forEach(([field, rule]) => {
      const value = data[field];
      if (rule.required && (!value || value.toString().trim() === "")) {
        newErrors[field] = `${field} is required.`;
      } else if (rule.min && value < rule.min) {
        newErrors[field] = `${field} must be at least ${rule.min}.`;
      } else if (rule.validate && typeof rule.validate === "function") {
        const error = rule.validate(value);
        if (error) {
          newErrors[field] = error;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { errors, validate };
};
