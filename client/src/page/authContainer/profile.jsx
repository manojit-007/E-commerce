import { User } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { logOutUser } from "@/redux-store/auth/authThunkFunctions";
import { useNavigate } from "react-router-dom";
import AddressForm from "@/page/authContainer/addressForm";
import PasswordUpdate from "./passwordUpdate";

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
  const { user, isAdmin, isSeller, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

        {/* Profile Tab */}
        <TabsContent value="profile">
          <section className="p-8 bg-white rounded-xl shadow-lg">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-500 rounded-full shadow-md flex items-center justify-center">
                <User className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mt-4">
                {user.name}
              </h1>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-gray-600 capitalize">{user.role}</p>
              <p className="text-gray-400 mt-2">
                Joined on{" "}
                {new Date(user.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <div className="mt-6 w-full space-y-4">
                {isAdmin && (
                  <Button
                    onClick={() => navigate("/admin/dashboard")}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Admin Dashboard
                  </Button>
                )}
                {isSeller && (
                  <Button
                    onClick={() => navigate("/seller/dashboard")}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    Seller Dashboard
                  </Button>
                )}
                <Button
                  onClick={() => dispatch(logOutUser())}
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                >
                  Logout
                </Button>
              </div>
            </div>
          </section>
        </TabsContent>

        {/* Password Tab */}
        <TabsContent value="password">
          <section className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
           <PasswordUpdate />
          </section>
        </TabsContent>

        {/* Address Tab */}
        <TabsContent value="address">
          <section className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Manage Address</h2>
            <AddressForm user={user} />
          </section>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default Profile;
