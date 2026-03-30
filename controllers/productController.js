import Product from "../models/product.js";
// ✅ FIXED: Removed unused "jwt" import

export function getProducts(req, res) {
    Product.find({}).then((product) => {
        res.json(product);
    }).catch((error) => {
        res.status(500).json({ message: error.message });
    });
}

export function createProducts(req, res) {
    if (!isAdmin(req)) {
        // ✅ FIXED: Return proper 403 status instead of 200
        return res.status(403).json({
            message: "Please login as administrator to add product !!!"
        });
    }

    const newProductData = req.body;
    const product = new Product(newProductData);

    product.save().then(() => {
        res.json({
            message: "Product created successfully !!!"
        });
    }).catch((error) => {
        // ✅ FIXED: Return error.message (string) instead of raw error object
        res.status(500).json({ message: error.message });
    });
}

export function isAdmin(req) {
    if (req.user == null) return false;
    if (req.user.type !== "admin") return false;
    return true;
}

export function isCustomer(req) {
    if (req.user == null) return false;
    if (req.user.type !== "customer") return false;
    return true;
}