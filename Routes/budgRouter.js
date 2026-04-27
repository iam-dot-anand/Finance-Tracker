const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/authMiddleware');
const Budget = require('../Models/Budget');
const Expense = require('../Models/Expense');


router.post("/set", authMiddleware, async (req, res) => {
    try {
        const { category, limit, month, year } = req.body;

        if (!category || !limit || !month || !year) {
            return res.status(400).json({ message: "All fields required" });
        }

        const budget = await Budget.findOneAndUpdate(
            {
                userId: req.userId,
                category,
                month,
                year
            },
            {
                $set: { limit }
            },
            {
                new: true,
                upsert: true 
            }
        );

        res.json({
            message: "Budget saved successfully",
            budget
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error saving budget" });
    }
});



router.get("/status", authMiddleware, async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({ message: "Month and year required" });
        }

        const budgets = await Budget.find({
            userId: req.userId,
            month,
            year
        });

        const result = [];

        for (let b of budgets) {

            const expenseResult = await Expense.aggregate([
                {
                    $match: {
                        userId: b.userId,
                        category: b.category,
                        date: {
                            $gte: new Date(year, month - 1, 1),
                            $lt: new Date(year, month, 1)
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            ]);

            const spent = expenseResult[0]?.total || 0;
            const remaining = b.limit - spent;
            const percentage = b.limit > 0
                ? ((spent / b.limit) * 100).toFixed(2)
                : 0;

            result.push({
                category: b.category,
                budget: b.limit,
                spent,
                remaining,
                percentage
            });
        }

        res.json(result);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching budget status" });
    }
});


module.exports = router;