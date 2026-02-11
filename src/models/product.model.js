import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    reviews: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
        },
      },
    ],
    stock: {
      type: Number,
      required: true,
      dafault: 1,
    },
    images: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);