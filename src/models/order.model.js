import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    owner:{
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    orderTotal: {
      type: Number,
      required: true,
    },
    address: {
      type: Schema.Types.ObjectId,
      ref: "Address",
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);