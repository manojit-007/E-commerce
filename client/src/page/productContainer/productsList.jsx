import { Button } from "@/components/ui/button";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

const ProductsList = ({ products }) => {
  const navigate = useNavigate()
  // console.log(products);

  if (!products || products.length === 0) {
    return <div className="text-center p-4 text-gray-500">No products found.</div>;
  }


  return (
    <div className="p-4">
      <Table className="w-full border rounded-lg shadow-lg m-auto max-w-6xl">
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            {/* <TableHead>Name</TableHead> */}
            <TableHead>Seller</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id} className="hover:bg-gray-50">
              {/* Product Image */}
              <TableCell>
                <img
                  src={product.image?.imageUrl || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="w-16 h-16 object-contain"
                />
              </TableCell>
              {/* Product Name */}
              {/* <TableCell>{product.name}</TableCell> */}
              {/* Product Price */}
              <TableCell>{product.seller}</TableCell>
              {/* Actions */}
              <TableCell>
                <Button
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsList;
