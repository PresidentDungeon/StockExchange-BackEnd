import {Filter} from "../models/filter";
import {FilterList} from "../models/filterList";
import {StockEntity} from "../../infrastructure/data-source/entities/stock.entity";
import {Stock} from "../models/stock";

export const IStockServiceProvider = 'IStockServiceProvider'
export interface IStockService{

    getStock(filter: Filter): Promise<FilterList<Stock>>
    getStockByName(name: String): Promise<StockEntity>
    getStockByID(id: string): Promise<StockEntity>
    createStock(stock: Stock): Promise<boolean>
    updateStock(stock: StockEntity): Promise<boolean>
    deleteStock(stock: StockEntity): Promise<boolean>
    verifyStock(): Promise<boolean>
}
