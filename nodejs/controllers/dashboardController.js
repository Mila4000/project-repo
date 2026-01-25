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
export const getSalesTable = async (req, res) => {
    try {
        const sales = await dashboardService.getSalesTable();
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
};

export const getRevenueChartTable= async (req, res) => {
    try {
        const revenue = await dashboardService.getMonthlySalesExpenses();
        res.status(200).json(revenue);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
};