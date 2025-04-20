const calculatePrices = (items) => {
    const itemsPrice = items.reduce((acc, item) => {
        const validPrice = parseFloat(item.price) || 0; // Ensure valid price
        const validQuantity = parseInt(item.quantity, 10) || 0; // Ensure valid quantity
        return acc + validPrice * validQuantity;
      }, 0);
    
      if (isNaN(itemsPrice)) {
        throw new Error("Invalid item prices or quantities in order items.");
      }
    
      const taxPrice = parseFloat((itemsPrice * 0.05).toFixed(2)) || 0; // 5% tax
      const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping for orders above $100
      const totalPrice = itemsPrice + taxPrice + shippingPrice;
    
      return { itemsPrice, taxPrice, shippingPrice, totalPrice };
}