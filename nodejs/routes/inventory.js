
import express from "express";
import * as inventoryCountingController from "../controllers/inventoryCountingController.js";

const router = express.Router();

router.get("/", inventoryCountingController.getInventoryCounting);
router.post("/", inventoryCountingController.addInventoryCounting);

export default router;