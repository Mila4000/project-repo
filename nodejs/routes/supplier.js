
import express from "express";
import * as supplierController from "../controllers/supplierController.js";

const router = express.Router();

router.get("/", supplierController.getAllSuppliers);
router.get("/stats", supplierController.getSupplierStats);
router.post("/", supplierController.addSupplier);
router.put("/:id", supplierController.updateSupplier);
router.delete("/:id", supplierController.deleteSupplier);

export default router;
