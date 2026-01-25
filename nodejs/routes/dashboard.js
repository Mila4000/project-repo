// routes/purchasing.js
import express from "express";
import * as dashboardController from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", dashboardController.getRevenueChartTable);
router.get("/stats", dashboardController.getDashboardStats);
router.get("/sales-table", dashboardController.getSalesTable);
router.get("/orders", dashboardController.getOrderTable);
export default router;