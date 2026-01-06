import "./config/env.js"; 
import express from "express";
import cors from "cors";
import purchasingRouter from "./routes/purchasing.js";
import supplierRouter from "./routes/supplier.js";
import receivedItemsRouter from "./routes/receivedItems.js";
import customerListRouter from "./routes/customerList.js";
import stockItemRouter from "./routes/stockItems.js";
import inventoryCountRouter from "./routes/inventory.js"


const app = express();
const PORT = process.env.nodejs_port || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ERP Backend is running");
});

app.use("/api/purchasing", purchasingRouter);
app.use("/api/supplier", supplierRouter);
app.use("/api/received-items", receivedItemsRouter);
app.use("/api/customers", customerListRouter);
app.use("/api/stock",stockItemRouter);
app.use("/api/inventory",inventoryCountRouter);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
