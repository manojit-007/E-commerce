import { User } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { logOutUser } from "@/redux-store/auth/authThunkFunctions";
import { useNavigate } from "react-router-dom";

const Loader = ({ message }) => (
  <div className="flex items-center justify-center min-h-screen">
    <p className="text-xl text-blue-500 animate-pulse">
      {message || "Loading..."}
    </p>
  </div>
);

const ErrorComponent = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center p-4">
    <p className="text-red-500 text-lg">{message || "Something went wrong."}</p>
    {onRetry && (
      <Button
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
        onClick={onRetry}
      >
        Retry
      </Button>
    )}
  </div>
);

const Profile = () => {
  const { user, isAdmin,isSeller,loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  if (loading) return <Loader message="Loading profile..." />;
  if (error)
    return (
      <ErrorComponent
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  if (!user)
    return <ErrorComponent message="User information is not available." />;

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Tabs defaultValue="profile" className="w-full max-w-md">
        <TabsList className="flex justify-center mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
  <section className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg max-w-md mx-auto">
    <div className="flex flex-col items-center">
      {/* User Avatar */}
      <div className="flex w-24 h-24 items-center justify-center bg-blue-500 rounded-full shadow-md">
        <User className="w-16 h-16 text-white" />
      </div>

      {/* User Info */}
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-4">
        {user.name}
      </h1>
      <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
      <p className="text-gray-600 dark:text-gray-300 capitalize">{user.role}</p>
      <p className="text-gray-400 dark:text-gray-500 mt-2">
        Joined on{" "}
        {new Date(user.createdAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {/* Dashboard Buttons */}
      <div className="mt-6 space-y-4 w-full">
        {isAdmin && (
          <Button
            onClick={() => navigate("/admin/dashboard")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md"
          >
            Admin Dashboard
          </Button>
        )}
        {isSeller && (
          <Button
            onClick={() => navigate("/seller/dashboard")}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md"
          >
            Seller Dashboard
          </Button>
        )}
        <Button
          onClick={() => dispatch(logOutUser())}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-md"
        >
          Logout
        </Button>
      </div>
    </div>
  </section>
</TabsContent>


        <TabsContent value="password">
          <section className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <form>
              <Input
                type="password"
                placeholder="Current Password"
                className="mb-4"
                required
              />
              <Input
                type="password"
                placeholder="New Password"
                className="mb-4"
                required
              />
              <Input
                type="password"
                placeholder="Confirm Password"
                className="mb-4"
                required
              />
              <Button className="w-full bg-blue-500 text-white hover:bg-blue-600">
                Update Password
              </Button>
            </form>
          </section>
        </TabsContent>

        <TabsContent value="address">
          <section className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Manage Address</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="street" className="block text-gray-700 mb-2">
                  Street
                </label>
                <Input
                  id="street"
                  type="text"
                  placeholder="Street Address"
                  defaultValue={user.address?.street || ""}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="city" className="block text-gray-700 mb-2">
                  City
                </label>
                <Input
                  id="city"
                  type="text"
                  placeholder="City"
                  defaultValue={user.address?.city || ""}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="state" className="block text-gray-700 mb-2">
                  State
                </label>
                <Input
                  id="state"
                  type="text"
                  placeholder="State"
                  defaultValue={user.address?.state || ""}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="zip" className="block text-gray-700 mb-2">
                  ZIP Code
                </label>
                <Input
                  id="zip"
                  type="text"
                  placeholder="ZIP Code"
                  defaultValue={user.address?.zip || ""}
                  required
                />
              </div>
              <Button className="w-full bg-blue-500 text-white hover:bg-blue-600">
                Update Address
              </Button>
            </form>
          </section>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default Profile;
