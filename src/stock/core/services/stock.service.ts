import {Injectable} from '@nestjs/common';
import {IStockService} from "../primary-ports/stock.service.interface";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Filter} from "../models/filter";
import {FilterList} from "../models/filterList";
import {Stock} from "../models/stock";
import {v4 as uuidv4} from 'uuid';
import {StockEntity} from "../../infrastructure/data-source/postgres/entities/stock.entity";

@Injectable()
export class StockService implements IStockService{

    constructor(
        @InjectRepository(StockEntity)
        private stockRepository: Repository<StockEntity>
    ) {}

    async createStock(stock: Stock): Promise<boolean> {

        this.verifyStockEntity(stock);

        stock.id = uuidv4();

        const newStock = await this.stockRepository.create(stock);
        await this.stockRepository.save(newStock);
        return true;
    }

    async getStock(filter: Filter): Promise<FilterList<Stock>>{

        const [result, total] = await this.stockRepository.findAndCount(
            {
                where: {}, order: { name: "DESC" },
                take: filter.itemsPrPage,
                skip: (filter.currentPage - 1) * filter.itemsPrPage
            }
        );

        let stock: FilterList<Stock> = {totalItems: total, list: result}
        return stock;
    }

    async getStockByName(name: String): Promise<Stock> {
        const stockEntity: Stock = await this.stockRepository.findOne({ where: `"name" ILIKE '${name}'`});
        return stockEntity;
    }

    async getStockByID(id: string): Promise<Stock> {
        const stock: Stock = await this.stockRepository.findOne(id);
        return stock;
    }

    async updateStock(stock: Stock): Promise<boolean> {

        this.verifyStockEntity(stock);

        try{
            await this.stockRepository.update(stock.id, stock);
            return true;
        }
        catch (e) {
            throw new Error('Error updating stock in database');
        }

    }

    async deleteStock(stock: Stock): Promise<boolean> {
        const deleteResponse = await this.stockRepository.delete(stock.id);
        if(deleteResponse.affected){return true;}
        throw new Error('Stock could not be found or deleted');
    }

    async verifyStock(): Promise<boolean> {

        const date: Date = new Date()
        date.setHours(0); date.setMinutes(0); date.setSeconds(0); date.setMilliseconds(0);

        const result = await this.stockRepository.createQueryBuilder().update(StockEntity)
            .set({
                dailyStockPrice: () => '"currentStockPrice"',
                dailyTimestamp: new Date()})
            .where(`"dailyTimestamp" < '${date.toDateString()}'`)
            .execute();

        if(result.affected){
            return true;
        }
        return false;
    }

    verifyStockEntity(stock: Stock): void{

        if (stock.name.length < 2) {
            throw new Error('Stock name must be more than 2 chars');
        }

        if (stock.name.length > 16) {
            throw new Error('Stock name must be less than 16 chars');
        }

        if(stock.currentStockPrice < 0){
            throw new Error('Stock price must be 0 or above')
        }

        if(stock.currentStockPrice > 99999){
            throw new Error('Stock price must be under 99999')
        }

        if(stock.description.length < 1){
            throw new Error('Stock description must be more than 0 chars');
        }

        if(stock.description.length > 600){
            throw new Error('Stock description must be under 600 chars');
        }
    }

}
