import { toast } from "sonner";

export const toastMessage = (type, message) => {
  const baseStyle = {
    duration: 3000,
  };

  if (type === "success") {
    toast.success(message, {
      ...baseStyle,
      style: {
        background: "#dcfce7",
        color: "#166534",
        border: "1px solid #86efac",
      },
      action: [
        {
          label: "Undo",
          onClick: () => {
            // console.log("Undo action triggered");
          },
        },
        {
          label: "Close",
          onClick: toast.dismiss, // Built-in dismiss method to close the toast
        },
      ],
    });
  } else if (type === "error") {
    toast.error(message, {
      ...baseStyle,
      style: {
        background: "#ffe4e6",
        color: "#b91c1c",
        border: "1px solid #f43f5e",
      },
      action: [
        {
          label: "Close",
          onClick: toast.dismiss, // Close button for error messages
        },
      ],
    });
  }
};
