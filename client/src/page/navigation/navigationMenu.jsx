import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NavigationMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, isSeller, isAdmin } = useSelector(
    (state) => state.auth
  );
  const menuRef = useRef(null); // To detect clicks outside of the menu

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Close the menu if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <section className="absolute top-4 right-4 z-50">
      <div>
        <Button
          variant="secondary"
          size="icon"
          aria-label="Menu"
          data-testid="menu-button"
          className="border-2 bg-gray-50"
          onClick={toggleMenu}
        >
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 top-14 w-32 bg-white shadow-lg rounded-lg p-4 z-50"
        >
          <div className="flex flex-col gap-4">
            <Button
              onClick={() => {
                navigate("/");
                setMenuOpen(false); // Close menu after navigation
              }}
            >
              Home
            </Button>
            <Button
              onClick={() => {
                navigate("/cart");
                setMenuOpen(false); // Close menu after navigation
              }}
            >
              Cart
            </Button>

            {isAuthenticated ? (
              <>
                <Button
                  onClick={() => {
                    navigate("/profile");
                    setMenuOpen(false); // Close menu after navigation
                  }}
                >
                  Profile
                </Button>

                {isSeller && (
                  <Button
                    onClick={() => {
                      navigate("/seller/dashboard");
                      setMenuOpen(false); // Close menu after navigation
                    }}
                  >
                    Dashboard
                  </Button>
                )}

                {isAdmin && (
                  <Button
                    onClick={() => {
                      navigate("/admin/dashboard");
                      setMenuOpen(false); // Close menu after navigation
                    }}
                  >
                    Dashboard
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false); // Close menu after navigation
                  }}
                >
                  Login
                </Button>

                <Button
                  onClick={() => {
                    navigate("/register");
                    setMenuOpen(false); // Close menu after navigation
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default NavigationMenu;
