const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/authMiddleware');
const Expense = require('../Models/Expense');


router.post("/add", authMiddleware, async (req, res) => {
    try {
        const { amount, category, date, description } = req.body;

        if (!amount || !category) {
            return res.status(400).json({
                message: "Amount and category are required"
            });
        }

        const expense = new Expense({
            userId: req.userId,
            amount,
            category,
            date: date || Date.now(),
            description
        });

        await expense.save();

        res.status(201).json({
            message: "Expense added successfully",
            expense
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error adding expense"
        });
    }
});


router.get("/", authMiddleware, async (req, res) => {
    try {
        const { category } = req.query;

        let filter = { userId: req.userId };

        if (category) {
            filter.category = category;
        }

        const expenses = await Expense.find(filter)
            .sort({ date: -1 }); // latest first

        res.status(200).json(expenses);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error fetching expenses"
        });
    }
});

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { amount, category, date, description } = req.body;

        if (!amount && !category && !date && !description) {
            return res.status(400).json({
                message: "At least one field is required to update"
            });
        }

        const updatedExpense = await Expense.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.userId 
            },
            {
                $set: {
                    ...(amount && { amount }),
                    ...(category && { category }),
                    ...(date && { date }),
                    ...(description && { description })
                }
            },
            {
                new: true 
            }
        );

        if (!updatedExpense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json({
            message: "Expense updated successfully",
            updatedExpense
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error updating expense"
        });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const deletedExpense = await Expense.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!deletedExpense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json({
            message: "Expense deleted successfully",
            deletedExpense
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error deleting expense"
        });
    }
});


module.exports = router;