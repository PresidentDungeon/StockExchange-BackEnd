import {Filter} from "../models/filter";
import {FilterList} from "../models/filterList";
import StockEntity from "../../../entities/stock.entity";

export const IStockServiceProvider = 'IStockServiceProvider'
export interface IStockService{

    getStock(filter: Filter): Promise<FilterList<StockEntity>>
    getStockByName(name: String): Promise<StockEntity>
    getStockByID(id: number): Promise<StockEntity>
    createStock(stock: StockEntity): Promise<boolean>
    updateStock(stock: StockEntity): Promise<boolean>

}
