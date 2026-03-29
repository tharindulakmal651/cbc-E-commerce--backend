import Oder from "../models/order.js";
import {isCustomer} from  "controllers/orderController.js"

export async function createOrder(req, res) {
    //take the latest product id
    //cbc001

    try{
      const latestOrder = await Oder.findOne().sort({ date: -1 }).limit(1);

      let orderId
      if(latestOrder.length === 0){
        orderId = "CBC0001";

    }else{
      const currentOrderId = latestOrder[0].orderId;

      const numberString =currentOrderId.replace("CBC", "")
      
      const number = parseInt(numberString);

      const newNumber = (number + 1).toString().padStart(4, "0");
        orderId = "CBC" + newNumber
    }
    const newOrderData = req.body
    newOrderData.orderId = orderId
    newOrderData.email=req.user.email

    const order = new Oder(newOrderData)
    awit order.save()

    res.json({
        message: "Order created successfully !!!"
    })


    }catch(error){
        res.status(500).json({
            message:error.message
        });


    }
}


export async function getOrders(req, res) {
    try{
        const orders = await Oder.find({
            email: req.user.email
        });

        res.json(order)
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
}

