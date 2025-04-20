import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@/redux-store/authorized/authorizedThunkFunctions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserList = () => {
  const dispatch = useDispatch();
  const { users = [], loading, error } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20);
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      dispatch(getAllUsers());
    };
    if (!users.length) {
      fetchUsers();
    }
  }, [dispatch, users.length]);

  const filteredAndPaginatedUsers = useMemo(() => {
    const filteredUsers =
      roleFilter === "all"
        ? users
        : users.filter((user) => user.role === roleFilter);

    const startIndex = (currentPage - 1) * usersPerPage;
    return filteredUsers.slice(startIndex, startIndex + usersPerPage);
  }, [users, roleFilter, currentPage, usersPerPage]);

  const totalPages = useMemo(() => {
    const filteredUsersCount =
      roleFilter === "all"
        ? users.length
        : users.filter((user) => user.role === roleFilter).length;
    return Math.ceil(filteredUsersCount / usersPerPage);
  }, [users, roleFilter, usersPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
        User Management
      </h1>

      {/* Filter Section */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 shadow-md">
        <div className="flex items-center">
          <label className="text-sm font-medium text-gray-700 mr-2">
            Filter by Role:
          </label>
          <Select
            value={roleFilter}
            onValueChange={(value) => setRoleFilter(value)}
          >
            <SelectTrigger className="w-[180px] bg-gray-100 border rounded-lg px-4 py-2 shadow-sm">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
              <SelectItem value="seller">Sellers</SelectItem>
              <SelectItem value="user">Users</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search users..."
            className="px-4 py-2 border  shadow-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center mt-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-center bg-red-100 py-3 rounded-md shadow-md">
          <p className="font-semibold">Error: {error}</p>
        </div>
      )}

      {/* User List */}
      {!loading && !error && (
        <div className=" p-6 bg-white shadow-md">
          {filteredAndPaginatedUsers.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredAndPaginatedUsers.map((user) => (
                <li
                  key={user._id}
                  className="py-4 flex justify-between items-center hover:bg-gray-50 border-b last:border-b-0 px-4 transition duration-300"
                >
                  <div>
                    <p className="font-medium text-lg text-gray-800">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold shadow-sm ${
                      user.role === "admin"
                        ? "bg-blue-100 text-blue-700"
                        : user.role === "seller"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-gray-500">
              <p>No users found.</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="text-sm font-semibold text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserList;
