import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllProducts } from "@/redux-store/product/productThunkFunctions";
import { resetError } from "@/redux-store/product/productSlice";
import ProductsList from "@/page/productContainer/productsList";

const AllProducts = () => {
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.product);

  useEffect(() => {
    // Fetch all products on component mount
    dispatch(getAllProducts());

    // Reset error on component unmount
    return () => {
      dispatch(resetError());
    };
  }, [dispatch]);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl m-auto">
      <h2 className="text-xl text-center font-bold mb-4">All Products</h2>
      <ProductsList products={products} />
    </div>
  );
};

export default AllProducts;
