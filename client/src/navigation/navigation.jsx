import React, { useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOutUser } from "@/redux-store/auth/authThunkFunctions";
import { toastMessage } from "@/utils/tostMessage";

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
  }));

  const handleNavigation = useCallback((path) => navigate(path), [navigate]);

  const handleLogout = useCallback(async () => {
    try {
      const res = await dispatch(logOutUser()).unwrap();
      toastMessage("success", res.message || "Logged out successfully!");
    } catch (error) {
      toastMessage("error", error || "Logout failed. Please try again.");
      console.error("Logout error:", error);
    }
  }, [dispatch]);

  const roleBasedMenu = useCallback(() => {
    if (user?.role === "seller") {
      return (
        <MenubarItem
          className="cursor-pointer"
          onClick={() => handleNavigation("/sellerDashboard")}
        >
          Dashboard
        </MenubarItem>
      );
    }
    return null;
  }, [user?.role, handleNavigation]);

  return (
    <header className="fixed top-0 left-0 w-full h-[70px] bg-white shadow-md border-b-2 border-black/10 z-50">
      <section className="max-w-[1280px] mx-auto flex items-center justify-between p-4 px-7">
        {/* Brand and Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>WS</AvatarFallback>
          </Avatar>
          <span className="text-lg font-semibold hidden md:block">WanderShop</span>
        </div>

        {/* Menubar */}
        <Menubar className="flex space-x-4">
          {/* Products Menu */}
          <MenubarMenu>
            <MenubarTrigger
              className="cursor-pointer hover:text-blue-600"
              onClick={() => handleNavigation("/products")}
            >
              Products
            </MenubarTrigger>
          </MenubarMenu>

          {/* User Menu */}
          <MenubarMenu>
            <MenubarTrigger className="cursor-pointer hover:text-blue-600">Profile</MenubarTrigger>
            <MenubarContent>
              {isAuthenticated ? (
                <>
                  <MenubarItem
                    className="cursor-pointer"
                    onClick={() => handleNavigation("/profile")}
                  >
                    Profile
                  </MenubarItem>
                  {roleBasedMenu()}
                  <MenubarItem className="cursor-pointer" onClick={handleLogout}>
                    Logout
                  </MenubarItem>
                </>
              ) : (
                <>
                  <MenubarItem
                    className="cursor-pointer"
                    onClick={() => handleNavigation("/login")}
                  >
                    Login
                  </MenubarItem>
                  <MenubarItem
                    className="cursor-pointer"
                    onClick={() => handleNavigation("/register")}
                  >
                    Register
                  </MenubarItem>
                </>
              )}
              <MenubarSeparator />
              <MenubarItem className="cursor-pointer" onClick={() => handleNavigation("/cart")}>
                Cart
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </section>
    </header>
  );
};

export default Navigation;
