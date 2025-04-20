import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAllOrders,
  getSellerAllOrders,
  getUserOrders,
  updateOrderStatus,
} from "@/redux-store/order/orderThunkFunctions";
import { toastMessage } from "@/utils/tostMessage";
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AllOrders = () => {
  const navigate = useNavigate();
  const { isSeller, isAdmin, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const { orders = [], loading } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);

  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ordersPerPage = 10;

  if (!isAuthenticated) {
    toastMessage("error", "Please login to view orders");
    navigate("/login");
  }

  useEffect(() => {
    if (isAdmin) {
      dispatch(getAllOrders());
    } else if (isSeller) {
      dispatch(getSellerAllOrders());
    } else {
      dispatch(getUserOrders());
    }
  }, [dispatch, isAdmin, isSeller]);

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const filteredOrders = useMemo(() => {
    return filterStatus === ""
      ? orders
      : orders.filter((order) => order.orderStatus === filterStatus);
  }, [filterStatus, orders]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders?.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const totalPages = Math.ceil(filteredOrders?.length / ordersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const result = await dispatch(
        updateOrderStatus({ orderId, status: newStatus })
      ).unwrap();
      toastMessage("success", `Order status updated to ${newStatus}`);
      console.log("Status updated successfully:", result);
    } catch (error) {
      toastMessage("error", `Failed to update status: ${error}`);
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!orders?.length) {
    return <p>No orders found.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl text-center font-bold mb-4">All Orders</h1>
      <div className="mb-4">
        <label className="block mb-2">Filter by Status:</label>
        <select
          className="p-2 border rounded-md"
          value={filterStatus}
          onChange={handleFilterChange}
        >
          <option value="">All</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {currentOrders.length === 0 ? (
        <p>No orders found for the selected status.</p>
      ) : (
        <div className="grid gap-4">
          {currentOrders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 shadow-md bg-white"
            >
              <div className="flex flex-wrap items-center justify-between">
                <h2 className="text-lg font-semibold">Order ID: {order._id}</h2>
                <p>
                  <strong>Status:</strong> {order.orderStatus}
                </p>
              </div>
              {(user?.role === "admin" ||
                (user?.role === "seller" && user?._id === order?.sellerId)) && (
                <div className="mt-2 flex gap-2">
                  <label className="mb-2">Update Status:</label>
                  <Select
                    value={order.orderStatus}
                    onValueChange={(value) =>
                      handleStatusUpdate(order._id, value)
                    }
                    className="p-2 border rounded-md"
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue
                        placeholder={order.orderStatus}
                        value={order.orderStatus}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {["Processing", "Shipped", "Delivered"].map((status) =>
                        order.orderStatus !== status ? (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ) : null
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-4">
        <button
          className={`px-4 py-2 rounded-md ${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500"
          }`}
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`px-4 py-2 rounded-md ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500"
          }`}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllOrders;
