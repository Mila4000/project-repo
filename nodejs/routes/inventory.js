import express from "express";
import * as inventoryController from "../controllers/inventoryController.js";

const router = express.Router();

router.get("/", inventoryController.getinventory);
router.get("/stats", inventoryController.getCountingStats);
router.post("/", inventoryController.addinventory);
router.get("/brands", inventoryController.getBrands);
router.get("/brands/stats", inventoryController.getBrandStats);

export default router;