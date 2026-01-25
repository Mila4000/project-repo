
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

    return res.status(500).json({
      code: "PURCHASE_CREATE_FAILED",
      message: "Failed to save purchase"
    });
  }
};
export const updatePurchase = async (req, res) => {
  try {
    const data = await purchasingService.updatePurchase(req.params.po, req.body);
    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Purchase order not found" });
    }
    res.json(data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update purchase" });
  }
};

export const deletePurchase = async (req, res) => {
  try {
    await purchasingService.deletePurchase(req.params.po);
    res.json({ message: "Purchase deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete purchase" });
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