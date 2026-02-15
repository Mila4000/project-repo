import express from "express";
import * as receivedItemsController from "../controllers/receivedItemsController.js";

const router = express.Router();

router.get("/", receivedItemsController.getAllReceivedItems);
router.post("/", receivedItemsController.createReceivedItem);
router.put("/:id", receivedItemsController.updateReceivedItem);
router.delete("/:id", receivedItemsController.deleteReceivedItem);
router.put('/:id/deliver', receivedItemsController.deliverPurchasedOrder);
router.get("/stats", receivedItemsController.getReceivedItemsStats);
router.put("/view/bulk-save",receivedItemsController.bulkSaveItems);
export default router;
