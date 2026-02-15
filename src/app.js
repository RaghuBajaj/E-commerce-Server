import express from "express";

const app = express();
const PORT = 8000;

import userRouter from "./routes/user.router.js";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import orderRouter from "./routes/order.router.js";
import addressRouter from "./routes/address.router.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/address", addressRouter);

export { app };