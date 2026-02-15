import express from "express";
import * as purchasingController from "../controllers/purchasingController.js";

const router = express.Router();

// ==============================
// Purchases Collection
// ==============================
router.get("/", purchasingController.getAllPurchases);
router.post("/", purchasingController.createPurchase);

// ==============================
// Static / Utility Routes
// ==============================
router.get("/stats", purchasingController.getPurchaseStats);
router.get("/items", purchasingController.getBrands);

// ==============================
// Purchase-Specific Actions
// ==============================
router.patch("/approve/:id", purchasingController.approvePurchase);
router.patch("/reject/:id", purchasingController.rejectPurchase);

// ==============================
// Delivery
// ==============================
router.get(
  "/delivery-status-history/:id",
  purchasingController.displayDeliveryHistory
);
router.post(
  "/update-delivery-status/:id",
  purchasingController.updateDeliveryStatus
);

// ==============================
// Payment
// ==============================
router.get(
  "/payment-history/:id",
  purchasingController.getPaymentHistory
);
router.patch(
  "/payment/:id",
  purchasingController.updatePaymentHistory
);

// ==============================
// Receipt
// ==============================
router.patch(
  "/:id/receipt",
  purchasingController.updatePurchaseReceipt
);

// ==============================
// Core CRUD (LAST – dynamic param)
// ==============================
router.post("/remove/:po", purchasingController.removePurchase);

export default router;