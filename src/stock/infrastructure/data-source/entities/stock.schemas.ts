import * as mongoose from 'mongoose';

export const StockSchema = new mongoose.Schema({
    id: {type: String, required: true, unique: true},
    name: {type: String, unique: true, minlength: 2},
    description: String,
    currentStockPrice: {type: Number, min: 0},
    dailyStockPrice: {type: Number, min: 0},
    dailyTimestamp: {type: Date},
});
