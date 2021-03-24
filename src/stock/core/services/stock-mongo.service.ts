import {Inject, Injectable} from '@nestjs/common';
import {IStockService, IStockServiceProvider} from "../primary-ports/stock.service.interface";
import {Filter} from "../models/filter";
import {FilterList} from "../models/filterList";
import {Stock} from "../models/stock";
import {StockEntity} from "../../infrastructure/data-source/postgres/entities/stock.entity";
import {IStockRepository, IStockRepositoryProvider} from "../primary-ports/stock.repository.interface";

@Injectable()
export class StockMongoService implements IStockService {

    constructor(@Inject (IStockRepositoryProvider) private stockRepository: IStockRepository){}

    async createStock(stock: Stock): Promise<boolean> {

        this.verifyStockEntity(stock);

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

        this.verifyStockEntity(stock);

        try{return this.stockRepository.updateStock(stock);}
        catch (e) {throw new Error('Error updating stock in database');}
    }

    async deleteStock(stock: StockEntity): Promise<boolean> {
        return this.stockRepository.deleteStock(stock);
    }

    async verifyStock(): Promise<boolean> {
        return this.stockRepository.verifyStock();
    }

    verifyStockEntity(stock: Stock): void{

        if (stock.name.length < 2) {
            throw new Error('Stock name must be more than 2 characters');
        }

        if (stock.name.length > 16) {
            throw new Error('Stock name must be less than 16 characters');
        }

        if(stock.currentStockPrice < 0){
            throw new Error('Stock price must be 0 or above')
        }

        if(stock.currentStockPrice > 99999){
            throw new Error('Stock price must be under 99999')
        }

        if(stock.description.length < 1){
            throw new Error('Stock description must be more than 0 characters');
        }

        if(stock.description.length > 600){
            throw new Error('Stock description must be under 600 characters');
        }
    }
}
