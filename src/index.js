// require("dotenv").config({ path: "./.env" });
import dotenv from "dotenv";
import { app } from "./app.js";
dotenv.config({
  path: "./.env"
});

try {
  app.listen(process.env.PORT, () => {
    console.log(`Server is listening at port ${process.env.PORT}`);
  });
} catch (error) {
  console.log("Some error occured while running the server!", error);
}