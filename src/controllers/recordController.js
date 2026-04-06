const FinancialRecord = require('../models/FinancialRecord');

const createRecord = async (req, res) => {
  const { amount, type, category, date, description } = req.body;

  try {
    const record = await FinancialRecord.create({
      user: req.user._id,
      amount,
      type,
      category,
      date: date || Date.now(),
      description
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getRecords = async (req, res) => {
  const { type, category, startDate, endDate } = req.query;
  const filter = {};

  if (req.user.role !== 'Admin') {
    filter.user = req.user._id;
  }

  if (type) filter.type = type;
  if (category) filter.category = category;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  try {
    const records = await FinancialRecord.find(filter).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRecord = async (req, res) => {
  try {
    const record = await FinancialRecord.findById(req.params.id);

    if (record) {
      if (req.user.role !== 'Admin' && record.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this record' });
      }

      record.amount = req.body.amount || record.amount;
      record.type = req.body.type || record.type;
      record.category = req.body.category || record.category;
      record.date = req.body.date || record.date;
      record.description = req.body.description || record.description;

      const updatedRecord = await record.save();
      res.json(updatedRecord);
    } else {
      res.status(404).json({ message: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRecord = async (req, res) => {
  try {
    const record = await FinancialRecord.findById(req.params.id);

    if (record) {
      if (req.user.role !== 'Admin' && record.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this record' });
      }

      await record.deleteOne();
      res.json({ message: 'Record removed' });
    } else {
      res.status(404).json({ message: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSummary = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role !== 'Admin') {
      filter.user = req.user._id;
    }

    const records = await FinancialRecord.find(filter);

    const totalIncome = records
      .filter(r => r.type === 'income')
      .reduce((acc, r) => acc + r.amount, 0);

    const totalExpenses = records
      .filter(r => r.type === 'expense')
      .reduce((acc, r) => acc + r.amount, 0);

    const netBalance = totalIncome - totalExpenses;

    const categoryTotals = records.reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + r.amount;
      return acc;
    }, {});

    const recentActivity = await FinancialRecord.find(filter)
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalIncome,
      totalExpenses,
      netBalance,
      categoryTotals,
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
  getSummary
};
