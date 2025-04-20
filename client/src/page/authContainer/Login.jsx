import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "@/redux-store/auth/authThunkFunctions";
import { toastMessage } from "@/utils/tostMessage";
import Loader from "@/utils/loader";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Title from "@/components/reusableComponents/title";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const redirectPath = location.state?.from || "/profile";

  useEffect(() => {
    if (user) navigate(redirectPath, { replace: true });
  }, [user, navigate, redirectPath]);

  const toggleVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      return toastMessage("error", "Please provide valid credentials.");
    }

    try {
      const res = await dispatch(loginUser({ email, password })).unwrap();
      toastMessage("success", res.message || "Logged in successfully!");
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || err.message || "Login failed!";
      toastMessage("error", errorMessage);
    }
  };
  {
    loading && (
      <section className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Loader />
      </section>
    );
  }

  return (
    <section className="w-full min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-800">
      <Title title="Login page" />

      <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Log in</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="johndoe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col space-y-1 relative">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Enter your password"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={toggleVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-300 hover:text-blue-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full flex items-center justify-center"
            disabled={loading || !email.trim() || !password.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </Button>
        </form>

        {/* Register Redirect */}
        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
      </div>
    </section>
  );
};

export default Login;
