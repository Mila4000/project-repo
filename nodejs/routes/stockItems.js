import express from "express";
import * as stockItemsController from "../controllers/stockItemsController.js";
import * as stockTransferController from "../controllers/stockTransferController.js";

const router = express.Router();
//Stock Display
router.get("/", stockItemsController.getAllStockItems);
router.post("/", stockItemsController.addStockItems);
router.delete("/:id", stockItemsController.deleteStockItems)
router.get("/stats", stockItemsController.getStockItemsStats);
//Stock Transfer
// router.get("/", stockTransferController.getAllStockItems);
// router.post("/", stockItemsController.addStockItems);
// router.delete("/:id", stockItemsController.deleteStockItems)
// router.get("/stats", stockItemsController.getStockItemsStats);
export default router;

