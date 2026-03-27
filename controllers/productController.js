import Product from "../models/product.js";
import jwt from "jsonwebtoken";

export async function getProduct(req, res) {
  
    const productList = await Product.find()
    res.json(
        {
            list: productList
        })
        
        
}

export function createProduct(req, res) {
    // FIX 1: 'req,user' was a syntax error — changed to 'req.user'
    console.log(req.user);

    if (req.user == null) {
        res.json({
            // FIX 2: 'massage' typo fixed to 'message'
            message: "You are not authorized to create a product !"
        });
        return;
    }

    if (req.user.type !== "admin") {
        res.json({
            // FIX 3: 'massage' typo fixed to 'message'
            message: "Only admin can create a product !!!"
        });
        return;
    }

    // FIX 4: 'req.user' should be 'req.body' — we create product from request body, not user token
    const NewProduct = new Product(req.body);

    NewProduct.save().then(() => {
        res.json({
            message: "Product created successfully !!!"
        });
    }).catch((err) => {
        res.status(500).json({
            message: "Error creating Product !!!", error: err.message
        });
    });
}

export function deleteProduct(req, res) {
    Product.deleteOne({ name: req.params.name }).then(() => {
        res.json({
            message: "Product deleted successfully !!!"
        });
    }).catch((err) => {
        res.status(500).json({
            message: "Error deleting Product !!!", error: err.message
        });
    });
}

export function getProductByName(req, res) {
    const name = req.params.name;

    Product.find({ name: name }).then((productList) => {
        res.json({
            list: productList
        });
    }).catch(() => {
        res.json({
            message: "Error retrieving Product !!!"
        });
    });
}
