import * as dashboardService from '../services/dashboardService.js';

export const getOrderTable = async (req, res) => {
    try {
        const orders = await dashboardService.getOrderTable();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
};


export const getDashboardStats = async (req, res) => {
    try {
        const stats = await dashboardService.getDashboardStats();
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
};