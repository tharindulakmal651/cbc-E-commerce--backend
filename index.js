import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import productRouter from "./routes/productRouter.js";
import Product from "./models/product.js";

import userRouter from "./routes/userRouter.js";
import User from "./models/user.js";
import jwt from "jsonwebtoken";

const app = express();

const mongoURL = "mongodb+srv://admin:123@cluster0.n1fvej0.mongodb.net/?appName=Cluster0";

mongoose.connect(mongoURL);

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
});

app.use(bodyParser.json());

app.use(
    (req, res, next) => {
        // FIX 1: token was never declared — added const and correct extraction
        const token = req.header("Authorization")?.replace("Bearer ", "");
        

        if (token != null) {
            jwt.verify(token, "cbc-secret-key-7973", (err, decoded) => {
                // FIX 2: 'error' was undefined — changed to 'err'
                if (!err) {
                    req.user = decoded;
                }
            });
        }

        next();
    }
);

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
