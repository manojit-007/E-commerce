import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Title from "@/components/reusableComponents/title";
import { ShoppingCartIcon, TrashIcon } from "lucide-react";
import { createOrder } from "@/redux-store/order/orderThunkFunctions";
import { toastMessage } from "@/utils/tostMessage";

// Custom Hook for managing localStorage
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  };

  return [storedValue, setValue];
};

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [cartItems, setCartItems] = useLocalStorage("cart", []);

  useEffect(() => {
    document.title = "SmartBuy - Cart";
  }, []);

  const addToCart = (item) => {
    const updatedCart = cartItems.map((cartItem) =>
      cartItem.product === item.product
        ? {
            ...cartItem,
            quantity: Math.min(
              cartItem.quantity + 1,
              item.maxQuantity || Infinity
            ),
          }
        : cartItem
    );

    if (!cartItems.some((cartItem) => cartItem.product === item.product)) {
      updatedCart.push({ ...item, quantity: 1 });
    }

    setCartItems(updatedCart);

    const maxReachedItem = updatedCart.find(
      (cartItem) =>
        cartItem.product === item.product &&
        cartItem.quantity === (item.maxQuantity || Infinity)
    );

    if (maxReachedItem) {
      toast.info(`You have reached the maximum limit for ${item.name}.`);
    }
  };

  const decreaseQuantity = (productId) => {
    const updatedCart = cartItems.map((item) =>
      item.product === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => item.product !== productId);
    setCartItems(updatedCart);
    toast.success("Item removed from cart.");
  };
  // Handle checkout for a specific seller
  const handleCheckOut = async (sellerItems) => {
    if (!user) {
      toastMessage("info", "Please login to proceed to checkout.");
      navigate("/login");
      return;
    }
  
    if (!user.address) {
      console.log("add address");
      toastMessage("error", "Please add your address to proceed to checkout.");
      navigate("/profile");
      return;
    }
    
    const { street, city, state, zip } = user.address;
    
    // Validate required address fields
    if (!street || !city || !state || !zip) {
      console.log("add address");
      toastMessage("error", "Incomplete address. Please update your address.");
      navigate("/profile");
      return;
    }
  
    const orderData = {
      sellerId: sellerItems[0].seller,
      orderItems: sellerItems,
      shippingInfo: user.address,
      paymentInfo: {}, // Include payment info if applicable
    };
  
    console.log("Order data:", orderData);
  
    // Update cart: remove items sold by this seller
    const filteredItems = cartItems.filter(
      (item) => item.seller !== sellerItems[0].seller
    );
    localStorage.setItem("cart", JSON.stringify(filteredItems));
  
    // Dispatch createOrder action
    const result = await dispatch(createOrder(orderData));
  
    // Handle the result of the createOrder action
    if (createOrder.fulfilled.match(result)) {
      toastMessage("success", "Order placed successfully!");
      navigate("/order");
    } else if (createOrder.rejected.match(result)) {
      const errorMessage = result.payload || "Order creation failed.";
      toastMessage("error", errorMessage);
    }
  };
  

  // Group items by seller
  const groupedCartItems = useMemo(() => {
    return cartItems.reduce((grouped, item) => {
      if (!grouped[item.seller]) {
        grouped[item.seller] = [];
      }
      grouped[item.seller].push(item);
      return grouped;
    }, {});
  }, [cartItems]);

  // Calculate totals for each seller
  const sellerTotals = useMemo(() => {
    return Object.keys(groupedCartItems).reduce((totals, sellerId) => {
      const sellerItems = groupedCartItems[sellerId];
      const totalAmount = sellerItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      const gstAmount = totalAmount * 0.05;
      const finalAmount = totalAmount + gstAmount;

      totals[sellerId] = { totalAmount, gstAmount, finalAmount };
      return totals;
    }, {});
  }, [groupedCartItems]);

  // If cart is empty, display empty state
  if (cartItems.length === 0) {
    return (
      <div className="flex items-center flex-col justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty.</h1>
        <Button
          onClick={() => navigate("/allProducts")}
          aria-label="Go to All Products"
          className="bg-blue-600 text-white mt-4 px-4 py-2 rounded-md hover:bg-blue-800"
        >
          Browse Products
        </Button>
        <ShoppingCartIcon />
      </div>
    );
  }

  return (
    <section className="p-6">
      <Title title="Your Cart" />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>

      {/* Loop through grouped items by seller */}
      {Object.keys(groupedCartItems).map((sellerId) => {
        const sellerItems = groupedCartItems[sellerId];
        const { totalAmount, gstAmount, finalAmount } = sellerTotals[sellerId];

        return (
          <div key={sellerId} className="space-y-4 mb-6">
            <h2 className="font-semibold text-lg mb-4">
              Products from Seller: {sellerId}
            </h2>
            {sellerItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b pb-4"
              >
                <div
                  className="flex items-center gap-4"
                  onClick={() => navigate(`/product/${item.product}`)}
                >
                  <img
                    src={item.image || "/placeholder.jpg"}
                    alt={item.name}
                    className="w-16 h-16 object-contain rounded border"
                  />
                  <div>
                    <h2 className="font-semibold text-lg">{item.name}</h2>
                    <p className="text-gray-600">
                      ₹{item.price} x {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => decreaseQuantity(item.product)}
                    disabled={item.quantity <= 1}
                    className={`px-3 py-1 rounded text-white ${
                      item.quantity > 1
                        ? "bg-blue-600 hover:bg-blue-800"
                        : "bg-blue-300 cursor-not-allowed"
                    }`}
                    aria-label="Decrease quantity"
                  >
                    -
                  </Button>
                  <Button
                    onClick={() => addToCart(item)}
                    className="px-3 py-1 rounded text-white bg-blue-600 hover:bg-blue-800"
                    aria-label="Increase quantity"
                  >
                    +
                  </Button>
                  <button
                    onClick={() => removeFromCart(item.product)}
                    className="px-3 py-1 rounded text-white bg-red-500 hover:bg-red-700"
                    aria-label="Remove item"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}

            {/* Seller-specific checkout button */}
            <div className="mt-4 flex justify-between items-center">
              <Button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800"
                onClick={() => handleCheckOut(sellerItems)}
                aria-label="Proceed to Checkout for this Seller"
              >
                Checkout
              </Button>
            </div>

            {/* Seller-specific totals */}
            <div className="mt-4 bg-gray-50 p-4 rounded-md shadow-md flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">
                  Total: ₹{totalAmount.toFixed(2)}
                </p>
                <p className="text-lg font-semibold">
                  Tax: ₹{gstAmount.toFixed(2)}
                </p>
                <p className="text-lg font-bold">
                  Final Amount: ₹{finalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default Cart;
