import { Document } from 'mongoose';

export interface StockInterface extends Document {
    readonly id: number
    readonly name: string
    readonly description: string
    readonly currentStockPrice: number
    readonly dailyStockPrice: number
    readonly dailyTimestamp: Date
}
