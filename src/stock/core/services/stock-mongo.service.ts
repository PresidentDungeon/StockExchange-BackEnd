import {Inject, Injectable} from '@nestjs/common';
import {IStockService} from "../primary-ports/stock.service.interface";
import {StockEntity} from "../../infrastructure/data-source/entities/stock.entity";
import {Filter} from "../models/filter";
import {FilterList} from "../models/filterList";
import {Model} from "mongoose";
import {StockInterface} from "../../infrastructure/data-source/mongoDB/stockInterface";
import {v4 as uuidv4} from 'uuid';
import {Stock} from "../models/stock";

@Injectable()
export class StockMongoService implements IStockService {

    constructor(@Inject('STOCK_MODEL') private stockModel: Model<StockInterface>){}

    async createStock(stock: Stock): Promise<boolean> {

        stock.id = uuidv4();

        const createdStock = new this.stockModel(stock);
        await createdStock.save()
        return new Promise(resolve => {resolve(true);});
    }

    async getStock(filter: Filter): Promise<FilterList<Stock>> {

        const totalItems = await this.stockModel.find().countDocuments().exec()
        const result = await this.stockModel.find().limit(filter.itemsPrPage).
        skip((filter.currentPage - 1) * filter.itemsPrPage).sort({name: 'desc'}).exec()
        let stock: FilterList<StockEntity> = {totalItems: totalItems, list: result}
        return stock;
    }

    async getStockByName(name: String): Promise<StockEntity> {

        const stockEntity: StockEntity = await this.stockModel.findOne({name: new RegExp('^'+name+'$', "i")}).exec()
        return stockEntity;
    }

    async getStockByID(id: string): Promise<StockEntity> {

        const stockEntity: StockEntity = await this.stockModel.findOne({id: id}).exec()
        return stockEntity;
    }

    async updateStock(stock: StockEntity): Promise<boolean> {

        await this.stockModel.updateOne({id: stock.id}, stock).exec()
        return true;
    }

    async deleteStock(stock: StockEntity): Promise<boolean> {

        await this.stockModel.deleteOne({id: stock.id}).exec()
        return true;
    }

    async verifyStock(): Promise<boolean> {

        const date: Date = new Date()
        date.setHours(0); date.setMinutes(0); date.setSeconds(0); date.setMilliseconds(0);

        let stocks = await this.stockModel.find({ dailyTimestamp: {$lt: date}}).exec()
        stocks.forEach((stock) => {stock.dailyStockPrice = stock.currentStockPrice; stock.dailyTimestamp = new Date(); this.updateStock(stock);})
        
        return stocks.length > 0
    }
}
