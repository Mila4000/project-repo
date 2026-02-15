
import * as purchasingService from "../services/purchasingService.js";

export const getAllPurchases = async (req, res) => {
  try {
    const data = await purchasingService.getAllPurchases();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch purchases" });
  }
};

export const createPurchase = async (req, res) => {
  try {
    const result = await purchasingService.createPurchase(req.body);
    return res.status(201).json(result);

  } catch (err) {
    console.error("Purchase controller error:", err);

    if (err.message === "DUPLICATE_PO") {
      return res.status(409).json({
        code: "DUPLICATE_PO",
        message: "Purchase Order number already exists"
      });
    }

     return res.status(400).json({
      code: "INVOICE_CREATE_FAILED",
      message: err.message // 🔴 THIS IS THE FIX
    });
  }
};

export const removePurchase = async (req, res) => {
  try {
    await purchasingService.removePurchase(req.params.po);
    res.json({ message: "Purchase removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove purchase" });
  }
};

export const getPurchaseStats = async (req, res) => {
  try {
    const stats = await purchasingService.getPurchaseStats();
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load stats" });
  }
};

export const updatePurchaseReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const { receipt_url } = req.body;

    if (!receipt_url) {
      return res.status(400).json({ message: "receipt_url is required" });
    }

    const updatedPurchase =
      await purchasingService.updatePurchaseReceipt(id, receipt_url);

    res.json(updatedPurchase);
  } catch (err) {
    console.error("Update receipt error:", err);
    res.status(500).json({ message: err.message || "Failed to update receipt" });
  }
};
export const rejectPurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await purchasingService.updateStatus(id, "Rejected");

    res.json({
      message: "Purchase rejected",
      data: updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
export const approvePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await purchasingService.updateStatus(id, "Approved");

    res.json({
      message: "Purchase Approved",
      data: updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const displayDeliveryHistory = async (req, res) => {
  try {
    const deliveryData = await purchasingService.displayDeliveryHistory(req.params.id);
    res.json(deliveryData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load stats" });
  }
};
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { delivery_status, remarks } = req.body;

    if (!delivery_status) {
      return res.status(400).json({ message: "Delivery status is required" });
    }

    const updated = await purchasingService.updateDeliveryStatus(
      id,
      delivery_status,
      remarks
    );

    res.json({
      message: "Delivery status updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const updatePaymentHistory = async(req,res) => {
  try {
    const { id } = req.params;
    const paymentdata = req.body;

    const updated = await purchasingService.updatePaymentHistory(id,paymentdata);

    res.json({
      message: "Delivery status updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}
export const getPaymentHistory = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await purchasingService.getPaymentHistory(id);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch purchases" });
  }
};
export const getBrands = async (req, res) => {
  try {
    const data = await purchasingService.getBrands();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch purchases" });
  }
};