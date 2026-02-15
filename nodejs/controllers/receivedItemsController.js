import * as receivedItemsService from '../services/receivedItemsService.js';

export const getAllReceivedItems = async (req, res) => {
  try {
    const data = await receivedItemsService.getAllReceivedItems();
    res.json(data);
    } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch received items" });
  }
};

export const createReceivedItem = async (req, res) => {
  try {
    const data = await receivedItemsService.createReceivedItem(req.body);
    res.status(201).json(data);
    } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save received item" });
  }
};

export const updateReceivedItem = async (req, res) => {
  try {
    const data = await receivedItemsService.updateReceivedItem(
      req.params.id,
      req.body
    );

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Received item not found" });
    }

    res.status(200).json(data[0]); // 🔥 return FULL joined row

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update received item" });
  }
};

export const deleteReceivedItem = async (req, res) => {
    try {
        await receivedItemsService.deleteReceivedItem(req.params.id);
        res.status(204).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete received item" });
    }
};

export const getReceivedItemsStats = async (req, res) => {
    try {
        const stats = await receivedItemsService.getReceivedItemsStats();
        res.json(stats);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to load stats" });
    }
};

export const bulkSaveItems = async (req, res) => {
  try {
    const { items,transaction } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "Items must be an array" });
    }

    await receivedItemsService.bulkSave(items, transaction);

    res.status(200).json({ message: "Items saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Failed to save items" });
  }
};
export const deliverPurchasedOrder = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('Deliver request for PO ID:', id);

    const updatedOrder = await receivedItemsService.markAsDelivered(id);

    console.log('Updated Order:', updatedOrder);

    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Controller Error:', error);
    return res.status(500).json({
      message: error.message,
      error: error
    });
  }
};