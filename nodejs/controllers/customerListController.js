import * as customerListService from '../services/customerListService.js';

export const getAllCustomers = async (req, res) => {
    try {
        const customers = await customerListService.getAllCustomers();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
};

export const addCustomer = async (req, res) => {
  try {
    const data = await customerListService.addCustomers(req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save purchase" });
  }
};

export const updateCustomer = async(req ,res)=> {
    try {
        const updateData = req.body;
        const data = await customerListService.updateCustomer(req.params.id, updateData);

        if (!data || data.length === 0) {
            return res.status(404).json({message: "Customers not found"});
        }
        res.json(data[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Failed to update customers"})
    }
}
export const deleteCustomerData = async(req,res)=>{
    try {
        await customerListService.deleteCustomer(req.params.id);
        res.json({message:"Customer Data deleted"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Failed to delete customer data"})
    }
};

export const getCustomerStats = async (req,res) => {
  try {
    const stats = await customerListService.getCustomerStats();
    res.json(stats);
    } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load stats" });
    }
};