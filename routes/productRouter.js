import express from "express";
import { getProduct, createProduct, deleteProduct, getProductByName } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/", getProduct);
productRouter.post("/", createProduct);
productRouter.get("/:name", getProductByName);
productRouter.delete("/:name", deleteProduct);

export default productRouter;
