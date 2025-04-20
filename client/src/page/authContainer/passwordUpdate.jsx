import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePassword } from "@/redux-store/auth/authThunkFunctions";
import { toastMessage } from "@/utils/tostMessage";
import checkPassword from "@/utils/validateFields";
import { Eye, EyeClosed } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const PasswordUpdate = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [password, setPassword] = useState({
    email: user?.email || "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setPassword((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate that passwords match
      if (password.newPassword !== password.confirmPassword) {
        toastMessage("error", "New password and confirm password must match");
        return;
      }

      // Validate password strength
      if (!checkPassword(password.newPassword)) {
        toastMessage("error", "Password must meet the minimum strength requirements");
        return;
      }

      // Dispatch the action to update the password
      const response = await dispatch(updatePassword(password));

      // Handle success or failure based on the response structure
      if (response?.payload?.success) {
        toastMessage("success", "Password updated successfully!");
        setPassword({
          email: user?.email || "",
          password: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toastMessage(
          "error",
          response?.payload?.message || "Failed to update password"
        );
      }
    } catch (error) {
      toastMessage("error", error.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {["password", "newPassword", "confirmPassword"].map((field) => (
        <div className="mb-4" key={field}>
          <label htmlFor={field} className="block text-gray-700 mb-2 capitalize">
            {field.replace(/([A-Z])/g, " $1").toLowerCase()}
          </label>
          <Input
            id={field}
            type={showPassword ? "text" : "password"}
            placeholder={`Enter your ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`}
            value={password[field]}
            onChange={handleChange}
            required
          />
          
        </div>
      ))}
      <Button type="button" className="mb-2" 
      onClick={()=>setShowPassword(!showPassword)}>
            {showPassword ? <EyeClosed /> : <Eye/>} 
          </Button>
      <Button
        type="submit"
        className="w-full bg-blue-500 text-white hover:bg-blue-600"
      >
        Update Password
      </Button>
    </form>
  );
};

export default PasswordUpdate;
