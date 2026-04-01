export const generateWhatsAppMessage = (cart: any[], userDetails: { name: string; address: string; slot: string }) => {
  const WHATSAPP_NUMBER = "94770599229"; 
  
  let message = `🛒 *F&F Mart Order*\n\n`;
  message += `👤 *Name:* ${userDetails.name}\n`;
  message += `📍 *Address:* ${userDetails.address}\n`;
  message += `⏰ *Delivery:* ${userDetails.slot}\n\n`;
  message += `🛍️ *Order Details:*\n`;

  let total = 0;
  cart.forEach((item) => {
    const itemTotal = item.variant.price * item.quantity;
    total += itemTotal;
    message += `▪ ${item.quantity}x ${item.product.name} (${item.variant.name}) - Rs. ${itemTotal}\n`;
  });

  message += `\n💰 *Final Total: Rs. ${total}*\n\n`;
  message += `Thank you for shopping with F&F Mart!`;

  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
};
