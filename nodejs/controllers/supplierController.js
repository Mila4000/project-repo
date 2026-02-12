import e from "express";
import * as supplierService from "../services/supplierService.js";

export const getAllSuppliers = async (req, res) => {
  try {
    const data = await supplierService.getAllSuppliers();  
    res.json(data);
    } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch suppliers" });
    }
};

export const getSupplierStats = async (req, res) => {
  try {
    const stats = await supplierService.getSupplierStats();
    res.json(stats);
    } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load stats" });
    }
};
export const addSupplier = async (req, res) => {
  try {
    const newSupplier = req.body;
    const data = await supplierService.addSupplier(newSupplier);
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add supplier" });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const updatedSupplier = req.body;
    const data = await supplierService.updateSupplier(req.params.id, updatedSupplier);

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json(data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update supplier" });
  }
};
export const deleteSupplier = async (req, res) => {
  try {
    await supplierService.deleteSupplier(req.params.id);
    res.json({ message: "Supplier deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete supplier" });
  }
};

