import express from "express";
import {
  deleteProduct,
  getAdminProducts,
  getAllProducts,
  getCategories,
  getLatestProducts,
  getSingleProduct,
  newProduct,
  updateProduct,
} from "../controllers/products.js";
import { singleUpload } from "../middlewares/multer.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

// Create new product - api/v1/product/new
app.post("/new", adminOnly, singleUpload, newProduct);

app.get("/latest", getLatestProducts);

app.get("/categories", getCategories);

app.get("/admin-products", adminOnly, getAdminProducts);

app.get("/all", getAllProducts);

app
  .route("/:id")
  .get(getSingleProduct)
  .put(singleUpload, adminOnly, updateProduct)
  .delete(adminOnly, deleteProduct);

export default app;
