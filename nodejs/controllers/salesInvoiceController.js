import * as salesInvoiceService from '../services/salesInvoiceService.js';

export const getSales = async (req,res) =>{
    try {
        const data = await salesInvoiceService.getAllSales();
        res.json(data);

    } catch (error) {
        res.status(500).json({error:"Failed to get all sales"});
    }
}

export const addSalesInvoice = async(req,res) =>{
    try {
        const result = await salesInvoiceService.addSales(req.body);
        return res.status(201).json(result);
    
      } catch (err) {
        console.error("Sales Invoice controller error:", err);
    
        if (err.message === "DUPLICATE_SI") {
          return res.status(409).json({
            code: "DUPLICATE_SI",
            message: "Sales Invoice number already exists"
          });
        }
    
        return res.status(400).json({
          code: "INVOICE_CREATE_FAILED",
          message: err.message // 🔴 THIS IS THE FIX
        });
      }
}
export const getSalesStats = async (req, res) => {
  try {
    const stats = await salesInvoiceService.getSalesStats();
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load stats" });
  }
};
export const updateSalesFiles = async (req, res) => {
  try {
    const { id } = req.params;
    const  fileURL = req.body;

    if (!fileURL) {
      return res.status(400).json({ message: "receipt_url is required" });
    }

    const updatedPurchase =
      await salesInvoiceService.updateSalesFiles(id, fileURL);

    res.json(updatedPurchase);
  } catch (err) {
    console.error("Update receipt error:", err);
    res.status(500).json({ message: err.message || "Failed to update receipt" });
  }
};

export const deleteSalesInvoice = async (req, res) => {
  try {
    await salesInvoiceService.deleteSalesInvoice(req.params.si);
    res.json({ message: "Sales Invoice deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete sales invoice" });
  }
};

export const displayDeliveryHistory = async (req, res) => {
  try {
    const deliveryData =
      await salesInvoiceService.displayDeliveryHistory(req.params.id);

    res.json(deliveryData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load delivery history" });
  }
};

export const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { delivery_status, remarks } = req.body;

    if (!delivery_status) {
      return res.status(400).json({
        message: "Delivery status is required",
      });
    }

    const updated =
      await salesInvoiceService.updateDeliveryStatus(
        id,
        delivery_status,
        remarks
      );

    res.json({
      message: "Delivery status updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
export const rejectSales = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await salesInvoiceService.updateStatus(id, "Rejected");

    res.json({
      message: "Purchase rejected",
      data: updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
export const approveSales = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await salesInvoiceService.updateStatus(id, "Approved");

    res.json({
      message: "Purchase Approved",
      data: updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const updateProofOfPaymentHistory = async(req,res) => {
  try {
    const { id } = req.params;
    const paymentdata = req.body;

    const updated = await salesInvoiceService.updatePaymentHistory(id,paymentdata);

    res.json({
      message: "Proof of payment updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}
export const getProofOfPaymentHistory = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await salesInvoiceService.getPaymentHistory(id);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch sales" });
  }
};