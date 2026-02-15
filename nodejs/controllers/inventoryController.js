import * as inventoryService from '../services/inventoryService.js';

export const getinventory = async (req, res) => {
    try {
        const customers = await inventoryService.getAllInvCounting();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
};
export const addinventory = async (req, res) => {
    try {
        const customers = await inventoryService.addInvCounting(req.body);
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
};
export const getCountingStats = async (req, res) => {
    try {
        const count = await inventoryService.getCountingStats();
        res.status(200).json(count);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
};

export const getBrands = async (req, res) => {
    try {
        const brands = await inventoryService.getBrands();
        res.status(200).json(brands);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch brands' });
    }
};

export const getBrandStats = async (req, res) => { 
    try {
        const stats = await inventoryService.getBrandStats();
        res.status(200).json(stats);

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch brand stats' });
    }
};