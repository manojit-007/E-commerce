import { toastMessage } from "./tostMessage";

export const cartHandler = {
  addToCart: (product) => {
    console.log(product);
    const { name, image, price, _id: productId, seller } = product;
    console.log(name, image, price, productId, seller);

    // Destructure the product object and prepare the item for the cart
    const item = {
      name,
      image: image?.imageUrl || "/placeholder.jpg",
      price,
      quantity: 1,
      product: productId,
      seller,
    };

    // Retrieve the cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if the product already exists in the cart
    const existingProduct = existingCart.find(
      (cartItem) => cartItem.product === productId
    );

    if (existingProduct) {
      // Increase quantity if product already exists
      existingProduct.quantity += 1;
    } else {
      // Add new item to the cart
      existingCart.push(item);
    }

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart));
    toastMessage("success", "Product added to cart!");
  },

  removeFromCart: (productId) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    // Filter out the product to be removed
    const updatedCart = existingCart.filter(
      (item) => item.product !== productId
    );

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toastMessage("success", "Product removed from cart!");
  },

  increaseQuantity: (productId) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    // Update quantity for the specific product
    const updatedCart = existingCart.map((item) =>
      item.product === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toastMessage("success", "Product quantity increased!");
  },

  decreaseQuantity: (productId) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    // Decrease quantity only if greater than 1
    const updatedCart = existingCart.map((item) =>
      item.product === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toastMessage("success", "Product quantity decreased!");
  },

  getCart: () => {
    // Retrieve cart from localStorage
    return JSON.parse(localStorage.getItem("cart")) || [];
  },
};
