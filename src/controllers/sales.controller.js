import SalesRecord from "../model/sales.model.js";

export const getAllSales = async (req, res) => {
  try {
    const salesRecords = await SalesRecord.find()
      .populate("receiptId")
      .populate("orderId");
    res.send(salesRecords);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getSalesRecordByRange = async (req, res) => {
  try {
    const getSalesByRange = await SalesRecord.find({
        recordDate: {
            $gte: new Date(endDate)
        }
    })
    .populate('receiptId')
    .populate('orderId');
    res.send(getSalesByRange)
  } catch (error) {
    res.status(500).send( error  )
  }
};
