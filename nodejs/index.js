import "./config/env.js"; 
import express from "express";
import cors from "cors";
import purchasingRouter from "./routes/purchasing.js";
import supplierRouter from "./routes/supplier.js";
import receivedItemsRouter from "./routes/receivedItems.js";
import customerListRouter from "./routes/customerList.js";
import stockItemRouter from "./routes/stockItems.js";
import inventoryRouter from "./routes/inventory.js";
import dashboardRouter from "./routes/dashboard.js";

import salesInvoiceRouter from "./routes/salesInvoice.js";


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://jabmeats.netlify.app",
    "https://jab-meats.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ERP Backend is running");
});

app.use("/api/purchasing", purchasingRouter);
app.use("/api/supplier", supplierRouter);
app.use("/api/received-items", receivedItemsRouter);
app.use("/api/customers", customerListRouter);
app.use("/api/stock",stockItemRouter);
app.use("/api/inventory",inventoryRouter);
app.use("/api/dashboard",dashboardRouter);
app.use("/api/sales-invoice",salesInvoiceRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
