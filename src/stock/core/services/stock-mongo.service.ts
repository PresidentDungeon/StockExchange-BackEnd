import {Inject, Injectable} from '@nestjs/common';
import {IStockService} from "../primary-ports/stock.service.interface";
import {Filter} from "../models/filter";
import {FilterList} from "../models/filterList";
import {Model} from "mongoose";
import {StockInterface} from "../../infrastructure/data-source/mongoDB/stockInterface";
import {v4 as uuidv4} from 'uuid';
import {Stock} from "../models/stock";
import {StockEntity} from "../../infrastructure/data-source/entities/stock.entity";
import {StockRepository} from "../../infrastructure/data-source/mongoDB/stock.repository";

@Injectable()
export class StockMongoService implements IStockService {

    constructor(private stockRepository: StockRepository){}

    async createStock(stock: Stock): Promise<boolean> {

        if (stock.name.length < 2) {
            throw new Error('Stock name must be more then 2 chars');
        }

        if(stock.currentStockPrice < 0){
            throw new Error('Stock price must be 0 or above')
        }

        try{return this.stockRepository.createStock(stock);}
        catch (e) {throw new Error('Error saving data to database');}
    }

    async getStock(filter: Filter): Promise<FilterList<Stock>> {
        return this.stockRepository.getStock(filter);
    }

    async getStockByName(name: String): Promise<StockEntity> {
        return this.stockRepository.getStockByName(name);
    }

    async getStockByID(id: string): Promise<StockEntity> {
        return this.stockRepository.getStockByID(id);
    }

    async updateStock(stock: StockEntity): Promise<boolean> {

        if (stock.name.length < 2) {
            throw new Error('Stock name must be more then 2 chars');
        }

        if(stock.currentStockPrice < 0){
            throw new Error('Stock price must be 0 or above')
        }

        try{return this.stockRepository.updateStock(stock);}
        catch (e) {throw new Error('Error updating stock in database');}
    }

    async deleteStock(stock: StockEntity): Promise<boolean> {
        return this.stockRepository.deleteStock(stock);
    }

    async verifyStock(): Promise<boolean> {
        return this.stockRepository.verifyStock();
    }
}
