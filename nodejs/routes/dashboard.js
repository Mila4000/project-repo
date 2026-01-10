// routes/purchasing.js
import express from "express";
import * as dashboardController from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", dashboardController.getOrderTable);
router.get("/stats", dashboardController.getDashboardStats);
export default router;
