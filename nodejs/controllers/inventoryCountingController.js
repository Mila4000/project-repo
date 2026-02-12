import * as inventoryCountingService from '../services/inventoryCountingService.js';

export const getInventoryCounting = async (req, res) => {
    try {
        const customers = await inventoryCountingService.getAllInvCounting();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
};
export const addInventoryCounting = async (req, res) => {
    try {
        const customers = await inventoryCountingService.addInvCounting(req.body);
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
};
export const getCountingStats = async (req, res) => {
    try {
        const count = await inventoryCountingService.getCountingStats();
        res.status(200).json(count);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
};