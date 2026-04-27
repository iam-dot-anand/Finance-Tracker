const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    source: {
        type: String,
        required: true 
    },
    frequency: {
        type: String,
        enum: ["one-time", "weekly", "monthly"],
        default: "one-time"
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("Income", incomeSchema);