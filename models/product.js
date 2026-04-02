import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String
    },

    productName: {
        type: String
    },

    price: {
        type: Number,
        required: true
    },

    images: [String],   // ✅ preferred

    image: {
        type: String    // ✅ fallback
    }
});

const Product = mongoose.model("Product", productSchema);

export default Product;