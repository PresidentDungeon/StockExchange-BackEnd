import {Filter} from "../models/filter";
import {FilterList} from "../models/filterList";
import {Stock} from "../models/stock";

export const IStockRepositoryProvider = 'IStockRepositoryProvider'
export interface IStockRepository{

    getStock(filter: Filter): Promise<FilterList<Stock>>
    getStockByName(name: String): Promise<Stock>
    getStockByID(id: string): Promise<Stock>
    createStock(stock: Stock): Promise<boolean>
    updateStock(stock: Stock): Promise<boolean>
    deleteStock(stock: Stock): Promise<boolean>
    verifyStock(): Promise<boolean>
}
