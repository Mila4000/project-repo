import express from "express";
import * as dashboardController from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", dashboardController.getRevenueChartTable);
router.get("/stats", dashboardController.getDashboardStats);
router.get("/sales-table", dashboardController.getSalesTable);
router.get("/sales-weight-chart", dashboardController.getSalesWeightChart);
router.get("/sales-purchase-counts-chart", dashboardController.getSalesPurchaseCountsChart);
router.get("/inventory-status", dashboardController.getInventoryStatus);
export default router;
