import { Headset, Shield, Truck } from "lucide-react";

export const features = [
  {
    icon: Headset,
    title: "24/7 Customer Support",
    description: "We are always here to help you with any queries or issues.",
    bgColor: "bg-blue-50",
    darkBgColor: "text-blue-600",
    border: "border-blue-600",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description:
      "Your transactions are safe with our encrypted payment gateway.",
    bgColor: "bg-green-50",
    darkBgColor: "text-green-600",
    border: "border-green-600",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Get your products delivered quickly and efficiently.",
    bgColor: "bg-yellow-50",
    darkBgColor: "text-yellow-500",
    border: "border-yellow-500",
  },
];

export const faqs = [
  {
    question: "Is it accessible?",
    answer: "Yes. It adheres to the WAI-ARIA design pattern.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and other secure payment options.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery times vary by location but typically range between 3-7 business days.",
  },
  {
    question: "Can I return a product?",
    answer:
      "Yes, we have a 30-day return policy. Please check our return policy for more details.",
  },
  {
    question: "How can I track my order?",
    answer:
      "You will receive a tracking link via email once your order has been shipped.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship to selected countries worldwide. Shipping fees may vary.",
  },
  {
    question: "Can I change my order after placing it?",
    answer: "Yes, you can modify your order within 24 hours of placing it.",
  },
];

export const categories = ["Electronics", "Clothing", "Accessories", "Home"];