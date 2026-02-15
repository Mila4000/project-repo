import * as dashboardService from '../services/dashboardService.js';

export const getSalesWeightChart = async (req, res) => {
    try {
        const orders = await dashboardService.getSalesWeightChart();
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
export const getSalesPurchaseCountsChart = async (req, res) => {
    try {
        const balances = await dashboardService.getSalesPurchaseCounts();
        res.status(200).json(balances);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
};
export const getInventoryStatus = async (req, res) => {
    try {
        const inventoryStatus = await dashboardService.getInventoryStatus();
        res.status(200).json(inventoryStatus);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch inventory status' });
    }
};