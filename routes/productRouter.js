import express from "express";
import { getProducts, createProducts } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.post("/", createProducts);

export default productRouter;
