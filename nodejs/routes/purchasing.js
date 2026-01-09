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
router.patch("/:id/receipt",purchasingController.updatePurchaseReceipt);
router.patch("/reject/:id", purchasingController.rejectPurchase);
router.patch("/approve/:id", purchasingController.approvePurchase);
router.get("/delivery-status-history/:id",purchasingController.displayDeliveryHistory);
router.post("/update-delivery-status/:id",purchasingController.updateDeliveryStatus);
router.patch("/payment/:id",purchasingController.updatePaymentHistory);
router.get("/payment-history/:id", purchasingController.getPaymentHistory);

export default router;