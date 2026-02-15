import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema({
  country: {
    type: String,
    required: true,
    default: "India",
  },
  fullName: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  addressLine1: {
    type: String,
    required: true,
  },
  area: {
    type: "String",
  },
  landmark: {
    type: "String",
  },
  pincode: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Address = mongoose.model("Address", addressSchema);