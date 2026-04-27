const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/authMiddleware');
const Income = require('../Models/Income');


router.post("/add", authMiddleware, async (req, res) => {
    try {
        const { amount, source, frequency, date, description } = req.body;

        if (!amount || !source) {
            return res.status(400).json({
                message: "Amount and source are required"
            });
        }

        const income = new Income({
            userId: req.userId,
            amount,
            source,
            frequency,
            date: date || Date.now(),
            description
        });

        await income.save();

        res.status(201).json({
            message: "Income added successfully",
            income
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error adding income" });
    }
});


router.get("/", authMiddleware, async (req, res) => {
    try {
        const { source } = req.query;

        let filter = { userId: req.userId };

        if (source) {
            filter.source = source;
        }

        const incomes = await Income.find(filter)
            .sort({ date: -1 });

        res.status(200).json(incomes);

    } catch (error) {
        res.status(500).json({ message: "Error fetching income" });
    }
});


router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { amount, source, frequency, date, description } = req.body;

        if (!amount && !source && !frequency && !date && !description) {
            return res.status(400).json({
                message: "At least one field required"
            });
        }

        const updatedIncome = await Income.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.userId
            },
            {
                $set: {
                    ...(amount && { amount }),
                    ...(source && { source }),
                    ...(frequency && { frequency }),
                    ...(date && { date }),
                    ...(description && { description })
                }
            },
            { new: true }
        );

        if (!updatedIncome) {
            return res.status(404).json({
                message: "Income not found"
            });
        }

        res.json({
            message: "Income updated successfully",
            updatedIncome
        });

    } catch (error) {
        res.status(500).json({ message: "Error updating income" });
    }
});


router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const deletedIncome = await Income.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!deletedIncome) {
            return res.status(404).json({
                message: "Income not found"
            });
        }

        res.json({
            message: "Income deleted successfully",
            deletedIncome
        });

    } catch (error) {
        res.status(500).json({ message: "Error deleting income" });
    }
});

module.exports = router;