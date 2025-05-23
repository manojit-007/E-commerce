import express from "express";
import {
  adminListedProducts,
  allProducts,
  createProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  productReview,
  sellerListedProducts,
  updateProduct,
} from "../controllers/productControllers.js";
import { verifyRole, verifyToken } from "../middleware/jsonWebToken.js";

const ProductRouter = (io) => {
  const router = express.Router();

  /** ----------------------- Product Creation ----------------------- */
  router.post(
    "/createProduct",
    verifyToken,
    verifyRole("admin", "seller"),
    createProduct
  );

  /** ----------------------- Product Retrieval ----------------------- */
  router.get("/allProducts",  getAllProducts); // Publicly accessible

  router.get(
    "/adminProducts",
    verifyToken,
    verifyRole("admin"),
    adminListedProducts
  );

  router.get(
    "/listedProducts",
    verifyToken,
    verifyRole("seller"),
    sellerListedProducts
  );

  router.get(
    "/allAdminOrSellerProducts",
    verifyToken,
    verifyRole("admin", "seller"),
    allProducts
  );

  router.get("/:productId", getProductById); // Publicly accessible

  /** ----------------------- Product Update ----------------------- */
  router.put(
    "/updateProduct/:productId",
    verifyToken,
    verifyRole("admin", "seller"),
    updateProduct(io)
  );

  /** ----------------------- Product Deletion ----------------------- */
  router.delete(
    "/:productId",
    verifyToken,
    verifyRole("admin", "seller"),
    deleteProductById
  );

  router.post(
    "/review",
    verifyToken,
    verifyRole("admin", "seller", "user"),
    productReview
  );

  return router;
};

export default ProductRouter;
