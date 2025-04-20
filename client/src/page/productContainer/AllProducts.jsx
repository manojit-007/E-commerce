/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const AllProducts = () => {
  const { keyword } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    searchQuery: keyword || "",
    pageNo: 1,
    price: [0, 5000],
  });

  const { products, loading, error, totalPages } = useSelector(
    (state) => state.product
  );

  // Set page title
  useEffect(() => {
    document.title = `SmartBuy - All Products`;
  }, []);

  // Fetch product list - memoized with useCallback
  const fetchProductList = useCallback(() => {
    dispatch(fetchProducts(formData));
  }, [dispatch, formData.searchQuery, formData.price, formData.pageNo]); // Only recreate when these dependencies change

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProductList();
    }, 300); // Add slight debounce

    return () => clearTimeout(timer);
  }, [fetchProductList]);

  // Handle error
  useEffect(() => {
    if (error) {
      toastMessage.error(error);
      dispatch(resetError());
    }
  }, [error, dispatch]);

  // Handle input change with debounce
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData(prev => ({ ...prev, pageNo: 1 })); // Reset to first page on new search
    fetchProductList();
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFormData((prev) => ({ ...prev, pageNo: newPage }));
      window.scrollTo({ top: 0, behavior: "smooth" });
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

    <section className="p-4">
      {/* Search Form */}
      <form
  className="flex flex-col sm:flex-row gap-4 items-center justify-center"
  onSubmit={handleSubmit}
>
  <Input
    name="searchQuery"
    placeholder="Search products..."
    value={formData.searchQuery}
    onChange={handleInputChange}
    className="max-w-md"
  />
  <div className="flex items-center gap-2">
    <Input
      type="number"
      name="priceMin"
      placeholder="Min Price"
      value={formData.price[0]}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          price: [Number(e.target.value), prev.price[1]],
        }))
      }
      className="w-24"
    />
    <span>-</span>
    <Input
      type="number"
      name="priceMax"
      placeholder="Max Price"
      value={formData.price[1]}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          price: [prev.price[0], Number(e.target.value)],
        }))
      }
      className="w-24"
    />
  </div>
  <Button type="submit">Search</Button>
</form>

    </section>

    {loading ? (
      <div className="fixed inset-0 bg-gray-950 bg-opacity-90 flex items-center justify-center z-50">
        <Loader />
      </div>
    ) : error ? (
      <section>
        <p className="text-red-500 text-center">{error}</p>
      </section>
    ) : (
      <>
        <section className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products?.length > 0 ? (
            products.map((product) => (
              <article
                key={product._id}
                className="border rounded-lg shadow bg-white p-4 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <figure className="w-full h-40 flex items-center justify-center">
                  <img
                    src={product.image?.imageUrl || "/placeholder.jpg"}
                    alt={product.name || "Product"}
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </figure>
                <div className="mt-4">
                  <h2 className="text-base font-semibold text-gray-800 line-clamp-2">
                    {product.name || "Unnamed Product"}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    ₹{product.price || "N/A"}
                  </p>
                </div>
                <div className="mt-4 flex gap-2 items-center justify-around">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${product._id}`);
                    }}
                    variant="outline"
                  >
                    Details
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      cartHandler.addToCart(product);
                      toast.success(`${product.name} added to cart`);
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

        {totalPages > 1 && (
          <div className="py-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    aria-label="Previous page"
                    disabled={formData.pageNo <= 1}
                    onClick={() => handlePageChange(formData.pageNo - 1)}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={formData.pageNo === index + 1}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    aria-label="Next page"
                    disabled={formData.pageNo >= totalPages}
                    onClick={() => handlePageChange(formData.pageNo + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <p className="text-center text-sm mt-2">
              Page {formData.pageNo} of {totalPages}
            </p>
          </div>
        )}
      </>
    )}
  </main>
  );
};

export default AllProducts;