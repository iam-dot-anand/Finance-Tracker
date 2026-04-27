    const express = require('express');
    const router = express.Router();
    const authMiddleware = require('../middleware/authMiddleware');
    const User = require('../Models/User');

    router.get("/getUser", authMiddleware, async (req, res) => {
        try {
            const user = await User.findById(req.userId).select("-password");
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: "Error fetching user" });
        }
    });


    router.delete("/deleteUser", authMiddleware, async (req, res) => {
        try {
            const userId = req.userId;

            const deletedUser = await User.findByIdAndDelete(userId);

            if (!deletedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({
                message: "User deleted successfully"
            });

        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    });

    router.get("/allUsers", async (req, res) => {
        try {
            const users = await User.find()

            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Error fetching users" });
        }
    });

    module.exports = router;