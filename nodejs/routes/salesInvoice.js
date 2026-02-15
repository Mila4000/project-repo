import express from "express";
import * as salesInvoiceController from "../controllers/salesInvoiceController.js";

const router = express.Router();

router.get("/", salesInvoiceController.getSales);
router.post("/", salesInvoiceController.addSalesInvoice);
router.get("/stats",salesInvoiceController.getSalesStats);
router.post("/remove/:si", salesInvoiceController.removeSalesInvoice);
router.patch(
  "/:id/uploads",
  salesInvoiceController.updateSalesFiles
);
router.patch("/approve/:id", salesInvoiceController.approveSales);
router.patch("/reject/:id", salesInvoiceController.rejectSales);
router.get(
  "/delivery-status-history/:id",
  salesInvoiceController.displayDeliveryHistory
);
router.post(
  "/update-delivery-status/:id",
  salesInvoiceController.updateDeliveryStatus
);
router.get(
  "/payment-history/:id",
  salesInvoiceController.getProofOfPaymentHistory
);
router.patch(
  "/payment/:id",
  salesInvoiceController.updateProofOfPaymentHistory
);


export default router;