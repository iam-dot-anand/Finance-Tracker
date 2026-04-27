const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/authMiddleware');
const Expense = require('../Models/Expense');
const Income = require('../Models/Income');


router.get("/", authMiddleware, async (req, res) => {
    try {
        const { type, category, source, startDate, endDate, search } = req.query;

        let expenseFilter = { userId: req.userId };
        let incomeFilter = { userId: req.userId };

        if (category) expenseFilter.category = category;
        if (source) incomeFilter.source = source;

        if (startDate && endDate) {
            expenseFilter.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
            incomeFilter.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        let expenses = [];
        let incomes = [];

        if (!type || type === "expense") {
            expenses = await Expense.find(expenseFilter).lean();
            expenses = expenses.map(e => ({
                ...e,
                type: "expense"
            }));
        }

        if (!type || type === "income") {
            incomes = await Income.find(incomeFilter).lean();
            incomes = incomes.map(i => ({
                ...i,
                type: "income"
            }));
        }

        let transactions = [...expenses, ...incomes];

        if (search) {
            transactions = transactions.filter(t =>
                (t.description && t.description.toLowerCase().includes(search.toLowerCase())) ||
                (t.category && t.category.toLowerCase().includes(search.toLowerCase())) ||
                (t.source && t.source.toLowerCase().includes(search.toLowerCase()))
            );
        }

        // 🔹 Sort by date (latest first)
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json(transactions);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching transactions" });
    }
});

module.exports = router;