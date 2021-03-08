import { Injectable } from '@nestjs/common';
import {IStockService} from "../primary-ports/stock.service.interface";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Filter} from "../models/filter";
import {FilterList} from "../models/filterList";
import {StockEntity} from "../../infrastructure/data-source/entities/stock.entity";

@Injectable()
export class StockService implements IStockService{

    constructor(
        @InjectRepository(StockEntity)
        private stockRepository: Repository<StockEntity>
    ) {}

    async getStock(filter: Filter): Promise<FilterList<StockEntity>>{

        const [result, total] = await this.stockRepository.findAndCount(
            {
                where: {}, order: { name: "DESC" },
                take: filter.itemsPrPage,
                skip: (filter.currentPage - 1) * filter.itemsPrPage
            }
        );

        var stock: FilterList<StockEntity> = {totalItems: total, list: result}
        return stock;
    }

    async createStock(stock: StockEntity): Promise<boolean> {
        const newStock = await this.stockRepository.create(stock);
        await this.stockRepository.save(newStock);
        return true;
    }

    async updateStock(stock: StockEntity): Promise<boolean> {
        await this.stockRepository.update(stock.id, stock);
        const updatedStock = await this.stockRepository.findOne(stock.id);
        return true;
    }

    async deleteStock(stock: StockEntity): Promise<boolean> {
        const deleteResponse = await this.stockRepository.delete(stock.id);
        if(deleteResponse.affected){return true;}
        return true;
    }

    async getStockByName(name: String): Promise<StockEntity> {
        const stockEntity: StockEntity = await this.stockRepository.findOne({ where: `"name" ILIKE '${name}'`});
        return stockEntity;
    }

    async getStockByID(id: number): Promise<StockEntity> {
        const stockEntity: StockEntity = await this.stockRepository.findOne(id);
        return stockEntity;
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
