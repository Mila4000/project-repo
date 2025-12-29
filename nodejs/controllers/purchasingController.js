
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
    const data = await purchasingService.createPurchase(req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save purchase" });
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
