import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import { registerUser } from "@/redux-store/auth/authThunkFunctions";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toastMessage } from "@/utils/tostMessage";
import { useRegisterForm } from "@/hooks/useRegisterForm";
import Loader from "@/utils/loader";
import { generateSecurePassword } from "@/utils/generatePassword";
import Title from "@/components/reusableComponents/title";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useRegisterForm();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = form.isFormValid();
    if (validation !== true) return toastMessage("error", validation);

    try {
      const res = await dispatch(registerUser(form.formData)).unwrap();
      toastMessage("success", res.message || "Registered successfully!");
      navigate("/login");
    } catch (err) {
      toastMessage("error", err || "Registration failed!");
    }
  };

  const toggleVisibility = (field) => {
    if (field === "password") setShowPassword((prev) => !prev);
    else setShowConfirmPassword((prev) => !prev);
  };

  const handleAutoPassword = async () => {
    const autoPassword = generateSecurePassword();
    if (!autoPassword) {
      toastMessage("error", "Couldn't generate password. Please enter it manually.");
      return;
    }
    ["password", "confirmPassword"].forEach((field) =>
      form.handleChange({
        target: {
          name: field,
          value: autoPassword,
        },
      })
    );
    try {
      await navigator.clipboard.writeText(autoPassword);
      toastMessage("success", "Password generated and copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy password:", err);
      toastMessage("error", "Password generated, but failed to copy to clipboard.");
    }
  };
  

  const inputFields = [
    { id: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
    {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "johndoe@example.com",
    },
  ];

  const roleOptions = ["seller", "user"];

  if (loading) return <Loader />;

  return (
    <section className="w-full h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-800 px-4">
      <Title title="Registration page" />
      <div className="bg-white dark:bg-gray-900 dark:text-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-2">Register</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          Create an account to start shopping!
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          {inputFields.map(({ id, label, type, placeholder }) => (
            <div key={id}>
              <Label htmlFor={id} className="mb-1 block text-sm font-medium">
                {label}
              </Label>
              <Input
                id={id}
                name={id}
                type={type}
                placeholder={placeholder}
                value={form.formData[id]}
                onChange={form.handleChange}
                required
              />
            </div>
          ))}

          {[
            { id: "password", label: "Password", show: showPassword },
            {
              id: "confirmPassword",
              label: "Confirm Password",
              show: showConfirmPassword,
            },
          ].map(({ id, label, show }) => (
            <div key={id} className="relative">
              <Label htmlFor={id} className="mb-1 block text-sm font-medium">
                {label}
              </Label>
              <Input
                id={id}
                name={id}
                type={show ? "text" : "password"}
                placeholder="********"
                value={form.formData[id]}
                onChange={form.handleChange}
                required
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => toggleVisibility(id)}
                className="absolute right-0 top-[24px] bg-gray-100"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={handleAutoPassword}>
            Generate Secure Password
          </Button>

          <div>
            <Label className="mb-2 block text-sm font-medium">
              Choose Role
            </Label>
            <div className="flex gap-4">
              {roleOptions.map((role) => (
                <Button
                  key={role}
                  type="button"
                  onClick={() => form.handleRoleChange(role)}
                  className={clsx(
                    "w-1/2 py-2 rounded-md font-semibold",
                    form.formData.role === role
                      ? "bg-blue-600 text-white hover:bg-blue-500"
                      : "bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white"
                  )}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className={clsx(
              "py-2 rounded-md w-full font-semibold",
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        {error && (
          <p className="text-red-500 text-center mt-3 text-sm">{error}</p>
        )}

        <p className="text-sm text-center mt-5">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </section>
  );
};

export default Register;
