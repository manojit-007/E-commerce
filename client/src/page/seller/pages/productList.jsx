import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Edit, ExternalLink, Loader } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";
import { sellerAllListedProducts } from "@/redux-store/product/productThunkFunctions";

const SellerProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.product);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(sellerAllListedProducts());
  }, [dispatch]);

  const totalPages = useMemo(
    () => Math.ceil((products?.length || 0) / itemsPerPage),
    [products]
  );
  const currentProducts = useMemo(
    () =>
      products?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [products, currentPage, itemsPerPage]
  );

  const renderPagination = () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          />
        </PaginationItem>
        {totalPages <= 5
          ? Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  onClick={() => setCurrentPage(index + 1)}
                  className={
                    currentPage === index + 1 ? "font-bold text-blue-500" : ""
                  }
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))
          : renderEllipsisPagination()}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );

  const renderEllipsisPagination = () => {
    const pages = [];
    const showEllipsisBefore = currentPage > 3;
    const showEllipsisAfter = currentPage < totalPages - 2;

    if (showEllipsisBefore) {
      pages.push(
        <PaginationItem key="1">
          <PaginationLink href="#" onClick={() => setCurrentPage(1)}>
            1
          </PaginationLink>
        </PaginationItem>,
        <PaginationEllipsis key="ellipsis-before" />
      );
    }

    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages, currentPage + 1);
      i++
    ) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={() => setCurrentPage(i)}
            className={currentPage === i ? "font-bold text-blue-500" : ""}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (showEllipsisAfter) {
      pages.push(
        <PaginationEllipsis key="ellipsis-after" />,
        <PaginationItem key={totalPages}>
          <PaginationLink href="#" onClick={() => setCurrentPage(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin w-10 h-10 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <p className="text-red-500 text-lg mb-4">
          {error || "Something went wrong. Please try again."}
        </p>
        <Button
          variant="outline"
          onClick={() => dispatch(sellerAllListedProducts())}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Seller Products</h1>
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="primary"
          className="bg-blue-500 text-white hover:bg-blue-600 m-auto"
          onClick={() => navigate("/seller/add-product")}
        >
          Add New Product
        </Button>
      </div>

      {products?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200 shadow-md rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4 border border-gray-300">Image</th>
                <th className="p-4 border border-gray-300">Id</th>
                <th className="p-4 border border-gray-300">Category</th>
                <th className="p-4 border border-gray-300">Price</th>
                <th className="p-4 border border-gray-300">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr
                  key={product._id}
                  className="text-center hover:bg-gray-50 transition duration-200"
                >
                  <td className="p-4 border border-gray-300">
                    <img
                      src={product.image?.imageUrl || "/placeholder.png"}
                      alt={product.name}
                      className="w-8 object-contain mx-auto rounded shadow"
                    />
                  </td>
                  <td
                    className="p-6 border border-gray-300 hover:cursor-pointer text-blue-600 font-semibold flex items-center justify-center gap-1"
                    onClick={() =>
                      navigate(`/seller/edit-product/${product._id}`)
                    }
                  >
                    {product._id}
                    <Edit className="w-4 h-4" />
                  </td>
                  <td className="p-4 border border-gray-300">
                    {product.category}
                  </td>
                  <td className="p-4 border border-gray-300">
                    ${product.price}
                  </td>
                  <td className="p-4 border border-gray-300">
                    {product.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-center">{renderPagination()}</div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg text-gray-600">No products found.</p>
        </div>
      )}
    </section>
  );
};

export default SellerProducts;
