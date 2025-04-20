export const forgotPasswordTemplate = (userName, resetUrl) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="text-align: center; color: #4CAF50;">SmartBuy Password Recovery</h2>
    <p>Hello <strong>${userName}</strong>,</p>
    <p>We received a request to reset your password. Click the button below to reset it:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
        Reset Password
      </a>
    </div>
    <p>If the button above doesn’t work, click or copy and paste the following link into your browser:</p>
    <p style="word-wrap: break-word; color: #0066cc; font-weight: bold;">${resetUrl}</p>
    <p>If you did not request this password reset, please ignore this email.</p>
    <p>Best regards,<br>SmartBuy Team</p>
  </div>
`;


export const orderConfirmationTemplate = (
  userName,
  orderId,
  orderItems,
  itemsPrice,
  taxPrice,
  shippingPrice,
  totalPrice,
  shippingInfo
) => {
  const orderDetails = orderItems
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">
          <img src="${item.image}" alt="${item.name}" style="width: 80px; height: auto; border-radius: 4px;" />
        </td>
        <td style="padding: 12px; border: 1px solid #ddd; text-align: left;">${item.name}</td>
        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">₹${(
          item.quantity * item.price
        ).toFixed(2)}</td>
      </tr>`
    )
    .join("");

  return `
    <div style="font-family: 'Arial', sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <h2 style="text-align: center; color: #4CAF50; font-size: 24px; margin-bottom: 20px;">SmartBuy Order Confirmation</h2>
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Hello <strong>${userName}</strong>,</p>
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        Thank you for your order! Your order <strong>#${orderId}</strong> has been successfully placed.
      </p>
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Here are the details of your order:</p>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr>
            <th style="padding: 12px; border: 1px solid #ddd; text-align: center; background-color: #f9f9f9;">Image</th>
            <th style="padding: 12px; border: 1px solid #ddd; text-align: left; background-color: #f9f9f9;">Product Name</th>
            <th style="padding: 12px; border: 1px solid #ddd; text-align: center; background-color: #f9f9f9;">Quantity</th>
            <th style="padding: 12px; border: 1px solid #ddd; text-align: right; background-color: #f9f9f9;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${orderDetails}
        </tbody>
      </table>
      <div style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        <p><strong>Items Price:</strong> ₹${itemsPrice.toFixed(2)}</p>
        <p><strong>Tax:</strong> ₹${taxPrice.toFixed(2)}</p>
        <p><strong>Shipping:</strong> ₹${shippingPrice.toFixed(2)}</p>
        <p><strong>Total:</strong> ₹${totalPrice.toFixed(2)}</p>
      </div>
      <div style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        <p><strong>Shipping Address:</strong></p>
        <p>${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.country} - ${shippingInfo.pinCode}</p>
        <p><strong>Phone:</strong> ${shippingInfo.phoneNo}</p>
      </div>
      <p style="font-size: 16px; line-height: 1.6; text-align: center; margin-top: 20px; color: #555;">
        If you have any questions about your order, please reply to this email or contact our customer support.
      </p>
      <p style="text-align: center; font-size: 16px; margin-top: 20px; color: #333;">
        Best regards,<br><strong>SmartBuy Team</strong>
      </p>
    </div>
  `;
};
