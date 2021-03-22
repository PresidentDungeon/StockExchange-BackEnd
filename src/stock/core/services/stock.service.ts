import {Inject, Injectable} from '@nestjs/common';
import {IStockService} from "../primary-ports/stock.service.interface";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Filter} from "../models/filter";
import {FilterList} from "../models/filterList";
import {StockEntity} from "../../infrastructure/data-source/entities/stock.entity";
import {Document, Model} from "mongoose";
import {StockInterface} from "../../infrastructure/data-source/mongoDB/stockInterface";
import {Stock} from "../models/stock";
import {v4 as uuidv4} from 'uuid';


@Injectable()
export class StockService implements IStockService{

    constructor(
        @InjectRepository(StockEntity)
        private stockRepository: Repository<StockEntity>
    ) {}

    async createStock(stock: Stock): Promise<boolean> {

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

        let stock: FilterList<StockEntity> = {totalItems: total, list: result}
        return stock;
    }

    async getStockByName(name: String): Promise<StockEntity> {
        const stockEntity: StockEntity = await this.stockRepository.findOne({ where: `"name" ILIKE '${name}'`});
        return stockEntity;
    }

    async getStockByID(id: string): Promise<StockEntity> {
        const stockEntity: StockEntity = await this.stockRepository.findOne(id);
        return stockEntity;
    }

    async updateStock(stock: StockEntity): Promise<boolean> {
        await this.stockRepository.update(stock.id, stock);
        return true;
    }

    async deleteStock(stock: StockEntity): Promise<boolean> {
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

}
