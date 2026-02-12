import * as stockItemsService from '../services/stockItemsService.js';

export const getAllStockItems = async (req, res) => {
  try {
    const data = await stockItemsService.getAllStockItems();
    res.json(data);
    } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch received items" });
  }
};
export const addStockItems = async (req, res) => {
  try {
    const newStocks = req.body;
    const data = await stockItemsService.createStockItem(newStocks);
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add supplier" });
  }
};

export const deleteStockItems = async (req, res) => {
  try {
    await stockItemsService.deleteStockItem(req.params.id);
    res.json({ message: "Supplier deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete supplier" });
  }
};

export const getStockItemsStats = async (req, res) => {
    try {
        const stats = await stockItemsService.getStockStats();
        res.json(stats);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to load stats" });
    }
};