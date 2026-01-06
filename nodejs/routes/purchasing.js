// routes/purchasing.js
import express from "express";
import * as purchasingController from "../controllers/purchasingController.js";

const router = express.Router();
//CreatePurchasing cx routes
router.get("/", purchasingController.getAllPurchases);
router.post("/", purchasingController.createPurchase);
router.put("/:po", purchasingController.updatePurchase);
router.delete("/:po", purchasingController.deletePurchase);
router.get("/stats", purchasingController.getPurchaseStats);

export default router;
