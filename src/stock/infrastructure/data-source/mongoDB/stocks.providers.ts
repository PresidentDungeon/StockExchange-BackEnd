import { Connection } from 'mongoose';
import {StockSchema} from "../entities/stock.schemas";

export const stocksProviders = [
    {
        provide: 'STOCK_MODEL',
        useFactory: (connection: Connection) => connection.model('Stock', StockSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
