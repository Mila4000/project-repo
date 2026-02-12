
import express from "express";
import * as inventoryCountingController from "../controllers/inventoryCountingController.js";

const router = express.Router();

router.get("/", inventoryCountingController.getInventoryCounting);
router.get("/stats", inventoryCountingController.getCountingStats);
router.post("/", inventoryCountingController.addInventoryCounting);

export default router;