import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema({
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
    cartTotal: {
        typeof: Number,
        default: 0,
    },
}, { timestamps: true });

export const Cart = mongoose.model("Cart", cartSchema);