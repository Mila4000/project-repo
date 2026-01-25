import express from "express";
import * as customerListController from "../controllers/customerListController.js";

const router = express.Router();

router.get("/", customerListController.getAllCustomers);
router.post("/", customerListController.addCustomer);
router.put("/:id", customerListController.updateCustomer);
router.delete("/:id", customerListController.deleteCustomerData);
router.get("/stats", customerListController.getCustomerStats); 

export default router;
