import * as mongoose from 'mongoose';

export const StockSchema = new mongoose.Schema({
    id: {type: String, required: true, unique: true},
    name: String,
    description: String,
    currentStockPrice: Number,
    dailyStockPrice: Number,
    dailyTimestamp: {type: Date},
});
