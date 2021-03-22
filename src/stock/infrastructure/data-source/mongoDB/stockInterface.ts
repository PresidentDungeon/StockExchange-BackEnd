import { Document } from 'mongoose';

export interface StockInterface extends Document {
    id: string
    name: string
    description: string
    currentStockPrice: number
    dailyStockPrice: number
    dailyTimestamp: Date
}
