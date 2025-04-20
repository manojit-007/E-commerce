import React from "react";
import { useSelector } from "react-redux";

const SellerDashboard = () => {
  const { name,email } = useSelector((state) => state.auth.user);

  return (
    <>
      <main
        className="relative min-h-screen bg-white flex flex-col p-4">
        {/* Main Content */}
          {/* Header */}
          <header className="mb-6 mt-8">
            <h1 className="text-3xl md:text-4xl font-bold text-black text-center">
              Welcome Back, {name}!
            </h1>
          </header>
              {email}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
            {[
              { title: "Total Sales", value: "$12,345", color: "text-blue-600" },
              { title: "Products Listed", value: "48", color: "text-green-600" },
              { title: "Pending Orders", value: "7", color: "text-red-600" },
            ].map((card, idx) => (
              <div
                key={idx}
                className="p-4 bg-white border backdrop-blur-md shadow-lg rounded-lg"
              >
                <h2 className="text-lg font-medium text-black">
                  {card.title}
                </h2>
                <p className={`text-2xl font-bold ${card.color}`}>
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          {/* Product Management */}
          <section className="mb-6">
            <h2 className="text-xl font-bold text-black mb-4">
              Manage Products
            </h2>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700">
                Add New Product
              </button>
              <input
                type="text"
                placeholder="Search Products"
                className="w-full sm:w-auto px-4 py-2 bg-white/40 backdrop-blur-md border rounded-lg shadow text-gray-700"
              />
            </div>
          </section>

          {/* Recent Orders */}
          <section>
            <h2 className="text-xl font-bold text-black mb-4">Recent Orders</h2>
            <div className="bg-white/40 backdrop-blur-md shadow-lg rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white/30">
                  <tr>
                    <th className="p-4 text-gray-700">Order ID</th>
                    <th className="p-4 text-gray-700">Customer</th>
                    <th className="p-4 text-gray-700">Total</th>
                    <th className="p-4 text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      id: "#1001",
                      customer: "John Doe",
                      total: "$250",
                      status: "Completed",
                    },
                    {
                      id: "#1002",
                      customer: "Jane Smith",
                      total: "$120",
                      status: "Pending",
                    },
                    {
                      id: "#1003",
                      customer: "Mike Johnson",
                      total: "$340",
                      status: "Completed",
                    },
                  ].map((order, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-4 text-gray-700">{order.id}</td>
                      <td className="p-4 text-gray-700">{order.customer}</td>
                      <td className="p-4 text-gray-700">{order.total}</td>
                      <td
                        className={`p-4 ${
                          order.status === "Completed"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {order.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
      </main>
    </>
  );
};

export default SellerDashboard;
