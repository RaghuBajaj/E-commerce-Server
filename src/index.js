// require("dotenv").config({ path: "./.env" });
import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.db.js";
dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`App is listening at port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Data base connection failed !!", error);
  });
  