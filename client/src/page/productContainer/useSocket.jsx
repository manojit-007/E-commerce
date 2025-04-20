import { useEffect } from "react";
import { io } from "socket.io-client";

const useSocket = (productId, onUpdate) => {
  const socket = io("http://localhost:8080", { autoConnect: false });

  useEffect(() => {
    socket.connect();

    const handleUpdate = ({ productId: updatedId, updatedQuantity }) => {
      if (updatedId === productId) {
        onUpdate(updatedQuantity);
      }
    };

    socket.on("productUpdate", handleUpdate);

    return () => {
      socket.off("productUpdate", handleUpdate);
      socket.disconnect();
    };
  }, [onUpdate, productId, socket]);

  return socket;
};

export default useSocket;
