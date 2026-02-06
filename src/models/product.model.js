import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    name: {
        typeof: String,
        require: true,
    },
    description: {
        typeof: String,
    },
    price: {
        typeof: Number,
        require: true,
    },
    category: {
        typeof: String,
        require: true,
    },
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);