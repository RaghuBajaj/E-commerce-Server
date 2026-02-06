import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    fullName: {
        typeof: String,
        require: true,
    },
    mobile: {
        typeof: Number,
        require: true,
    },
    email: {
        typeof: String,
    },
    password: {
        typeof: String,
        require: true
    },
    cart: {
        typeof: Schema.Types.ObjectId(),
        ref: "Cart",
    },
    order: {
        typeof: Schema.Types.ObjectId(),
        ref: "Order",
    },
    address: {
        typeof: Schema.Types.ObjectId(),
        ref: "Address",
    }
}, { timestamps: true});

export const User = mongoose.model("User", userSchema);