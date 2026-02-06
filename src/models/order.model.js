import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    products: [
        {
            product: {
                typeof: Schema.Types.ObjectId(),
                ref: "Product",
            },
            quantity: {
                typeof: Number,
                default: 0,
            },
            total: {
                typeof: Number,
                default: 0,
            }
        },
    ],
    owner: {
        typeof: Schema.Types.ObjectId(),
        ref: "User",
    },
    orderTotal: {
        typeof: Number,
        require: true,
    },
    address: {
        typeof: Schema.Types.ObjectId(),
        ref: "Address",
    },
    status: {
        typeof: String,
        enum: ["Pending", "Completed", "Cancelled"],
        default: "Pending"
    }
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);