const mongoose = require('mongoose');

const connectMongoDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://vishwaAnand:2Nim0kIBWjiINwTA@f-tracker.pu3tyvu.mongodb.net/?appName=f-tracker');
        console.log("MongoDB Connected");
    } catch (error) {
        console.log("DB Error:", error);
    }
};

module.exports = connectMongoDB;