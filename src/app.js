import express from "express";

const app = express();

import userRouter from "./routes/user.router.js";

app.use("/api/v1/users", userRouter);

export { app };