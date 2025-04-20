import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { resetError } from "@/redux-store/product/productSlice";
import { fetchProducts } from "@/redux-store/product/productThunkFunctions";
import { cartHandler } from "@/utils/cartHandler";
import Loader from "@/utils/loader";
import { toastMessage } from "@/utils/tostMessage";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const AllProducts = () => {
  const { keyword } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [pageNo, setPageNo] = useState(1);

  const { products, loading, error, totalPages } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    document.title = `SmartBuy - All Products`;
  }, []);

  const fetchProductList = useCallback(() => {
    dispatch(
      fetchProducts({
        searchQuery: keyword || "",
        pageNo,
        price: [0, 5000],
      })
    );
  }, [keyword, pageNo, dispatch]);

  useEffect(() => {
    fetchProductList();
  }, [fetchProductList]);

  useEffect(() => {
    if (error) {
      toastMessage.error(error);
      dispatch(resetError());
    }
  }, [error, dispatch]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPageNo(newPage);
    }
  };


  return (
    <main className="bg-gray-100 min-h-screen">
      <header className="w-full py-2 text-center">
        <h1 className="font-bold text-2xl text-gray-800">Featured Products</h1>
        <p className="text-gray-600">
          Explore our wide range of products and find what you need!
        </p>
      </header>
      {/* <SearchBox /> */}
      {loading ? (
        <div className="fixed inset-0 bg-gray-950 bg-opacity-90 flex items-center justify-center z-50">
          <Loader />
        </div>
      ) : error ? (
        <section>
          <p className="text-red-500 text-center">{error}</p>
        </section>
      ) : (
        <section className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products?.length > 0 ? (
            products.map((product) => (
              <article
                key={product._id}
                className="border rounded-lg shadow bg-white p-4 flex flex-col justify-between"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <figure className="w-full h-40 flex items-center justify-center">
                  <img
                    src={product.image?.imageUrl || "/placeholder.jpg"}
                    alt={product.name || "Product"}
                    className="max-h-full object-contain"
                  />
                </figure>
                <div className="mt-4">
                  <h2 className="text-base font-semibold text-gray-800">
                    {product.name || "Unnamed Product"}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    ₹{product.price || "N/A"}
                  </p>
                </div>
                <div className="mt-4 flex gap-2 items-center justify-around">
                  <Button onClick={() => navigate(`/product/${product._id}`)}>
                    Details
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      cartHandler.addToCart(product);
                    }}
                  >
                    Add to Cart
                  </Button>
                </div>
              </article>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              No products available.
            </p>
          )}
        </section>
      )}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              aria-label="Previous section"
              disabled={pageNo <= 1}
              onClick={() => handlePageChange(pageNo - 1)}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem
              key={index}
              active={pageNo === index + 1 ? "true" : undefined}
            >
              <PaginationLink onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              aria-label="Next section"
              disabled={pageNo >= totalPages}
              onClick={() => handlePageChange(pageNo + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <p className="text-center text-sm mt-2">
        Page {pageNo} of {totalPages}
      </p>
    </main>
  );
};

export default AllProducts;
