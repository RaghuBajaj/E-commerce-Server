import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema({
    pinCode: {
        typeof: String,
        require: true,
    },
    house: {
        typeof: String,
        require: true,
    },
    city: {
        typeof: String,
        require: true,
    },
    state: {
        typeof: String,
    },
    country: {
        typeof: String,
        require: true
    },
    owner: {
        typeof: Schema.Types.ObjectId(),
        ref: "User",
    },
});

export const Address = mongoose.model("Address", addressSchema);