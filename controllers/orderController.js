import Oder from "../models/order.js";
// ✅ FIXED: Import isCustomer from productController (this is where it lives)
import { isCustomer } from "../controllers/productController.js";

// Create Order
export async function createOrder(req, res) {
    // ✅ FIXED: Guard — only logged-in customers can create orders
    if (!isCustomer(req)) {
        return res.status(403).json({
            message: "Please login as a customer to create an order !!!"
        });
    }

    try {
        const latestOrder = await Oder.findOne().sort({ date: -1 });

        let orderId;

        if (!latestOrder) {
            orderId = "CBC0001";
        } else {
            const currentOrderId = latestOrder.orderId;
            const numberString = currentOrderId.replace("CBC", "");
            const number = parseInt(numberString);
            const newNumber = (number + 1).toString().padStart(4, "0");
            orderId = "CBC" + newNumber;
        }

        const newOrderData = req.body;
        newOrderData.orderId = orderId;
        newOrderData.email = req.user.email;

        const order = new Oder(newOrderData);
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

// Get Orders
export async function getOrders(req, res) {
    // ✅ FIXED: Guard — only logged-in customers can view their orders
    if (!isCustomer(req)) {
        return res.status(403).json({
            message: "Please login as a customer to view orders !!!"
        });
    }

    try {
        const orders = await Oder.find({
            email: req.user.email
        });

        res.json(orders);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}