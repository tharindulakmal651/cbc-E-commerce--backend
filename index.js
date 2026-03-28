import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

//import productRouter from "./routes/productRouter.js";
//import Product from "./models/product.js";

import userRouter from "./routes/userRouter.js";
import User from "./models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const mongoURL = process.env.MONGO_DB_URL;

//const mongoURL = "mongodb+srv://admin:123@cluster0.n1fvej0.mongodb.net/?appName=Cluster0";

mongoose.connect(mongoURL);

mongoose.connection.once("open", () => {
    console.log("Connected into mongoDB successfully !!!");
});

app.use(bodyParser.json());

app.use(
    (req, res, next) => {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (token != null) {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (!err) {
                    req.user = decoded;
                }
            });
        }

        next();
    }
);

//app.use("/api/products", productRouter);
app.use("/api/users", userRouter);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});