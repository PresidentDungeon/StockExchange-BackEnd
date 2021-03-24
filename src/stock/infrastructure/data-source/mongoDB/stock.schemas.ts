import * as mongoose from 'mongoose';

export const StockSchema = new mongoose.Schema({
    id: {type: String, required: true, unique: true},
    name: {type: String, unique: true, minlength: 2, maxlength: 16},
    description: {type: String, minlength: 1, maxlength: 600},
    currentStockPrice: {type: Number, min: 0, max: 99999},
    dailyStockPrice: {type: Number, min: 0, max: 99999},
    dailyTimestamp: {type: Date},
});
