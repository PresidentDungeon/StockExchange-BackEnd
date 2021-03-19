import {Inject, Injectable} from '@nestjs/common';
import {IStockService} from "../primary-ports/stock.service.interface";
import {StockEntity} from "../../infrastructure/data-source/entities/stock.entity";
import {Filter} from "../models/filter";
import {FilterList} from "../models/filterList";
import {Model} from "mongoose";
import {StockInterface} from "../../infrastructure/data-source/mongoDB/stockInterface";

@Injectable()
export class StockMongoService implements IStockService {

    constructor(
        @Inject('STOCK_MODEL')
        private stockModel: Model<StockInterface>
    ) {}

    createStock(stock: StockEntity): Promise<boolean> {
        const createdStock = new this.stockModel(stock);
        createdStock.save()
        return new Promise(resolve => {resolve(true);});
    }

    deleteStock(stock: StockEntity): Promise<boolean> {
        return Promise.resolve(false);
    }

    async getStock(filter: Filter): Promise<FilterList<StockEntity>> {
        const result = await this.stockModel.find().limit(filter.itemsPrPage).
        skip((filter.currentPage - 1) * filter.itemsPrPage).sort({name: 'desc'}).exec()
        var stock: FilterList<StockEntity> = {totalItems: result.length, list: result}
        return stock;
    }

    getStockByID(id: number): Promise<StockEntity> {
        return Promise.resolve(undefined);
    }

    getStockByName(name: String): Promise<StockEntity> {
        return Promise.resolve(undefined);
    }

    updateStock(stock: StockEntity): Promise<boolean> {
        return Promise.resolve(false);
    }

    verifyStock(): Promise<boolean> {
        return Promise.resolve(false);
    }
}
