import express from "express";
import {
  allOrders,
  deleteOrder,
  getSingleOrder,
  myOrders,
  newOrder,
  processOrder,
} from "../controllers/orders.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express();

app.post("/new", newOrder);

app.get("/myOrder", myOrders);

app.get("/all", adminOnly, allOrders);

app
  .route("/:id")
  .get(getSingleOrder)
  .put(adminOnly, processOrder)
  .delete(adminOnly, deleteOrder);
export default app;
