import Order from "../models/order.js";
import Product from "../models/product.js";
import { isCustomer } from "../controllers/productController.js";

// ✅ Create Order
export async function createOrder(req, res) {

    if (!isCustomer(req)) {
        return res.status(403).json({
            message: "Please login as a customer to create an order !"
        });
    }

    try {

        const latestOrder = await Order.findOne().sort({ date: -1 });

        let orderId;

        if (!latestOrder) {
            orderId = "CBC0001";
        } else {
            const number = parseInt(latestOrder.orderId.replace("CBC", ""));
            orderId = "CBC" + (number + 1).toString().padStart(4, "0");
        }

        const newOrderData = req.body;

        const newProductArray = [];

        for (let i = 0; i < newOrderData.orderedItems.length; i++) {

            const item = newOrderData.orderedItems[i];

            const product = await Product.findOne({
                productId: item.productId
            });

            // ❌ Product not found
            if (!product) {
                return res.status(400).json({
                    message: "Product not found: " + item.productId
                });
            }

            const name = product.productName || product.name;
            const price = product.price;
            const image =
                (product.images && product.images.length > 0)
                    ? product.images[0]
                    : product.image || "https://placehold.co/300x300?text=No+Image"; // ✅ FIXED: fallback image

            // ❌ Check only name and price — image always has a fallback
            if (!name || !price) {
                return res.status(400).json({
                    message: "Product data incomplete for: " + item.productId
                });
            }

            newProductArray.push({
                name: name,
                price: price,
                quantity: item.quantity,
                image: image
            });
        }

        newOrderData.orderedItems = newProductArray;

        newOrderData.orderId = orderId;
        newOrderData.email = req.user.email;

        const order = new Order(newOrderData);
        await order.save();

        res.json({
            message: "Order created successfully !!!",
            orderId: orderId
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


// ✅ Get Orders
export async function getOrders(req, res) {

    if (!isCustomer(req)) {
        return res.status(403).json({
            message: "Please login as a customer to view orders !!!"
        });
    }

    try {

        const orders = await Order.find({
            email: req.user.email
        });

        res.json(orders);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}