import { Injectable } from '@nestjs/common';
import {IStockService} from "../primary-ports/stock.service.interface";
import {Stock} from "../models/stock";
import {InjectRepository} from "@nestjs/typeorm";
import StockEntity from "../../../entities/stock.entity";
import {Repository} from "typeorm";
import {Filter} from "../models/filter";
import {FilterList} from "../models/filterList";

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
        try{
            const newStock = await this.stockRepository.create(stock);
            await this.stockRepository.save(newStock);
            return true;
        }
        catch (e) {

            return false;
        }
    }

    async updateStock(stock: StockEntity): Promise<boolean> {
        try{
            await this.stockRepository.update(stock.id, stock);
            const updatedStock = await this.stockRepository.findOne(stock.id);
            if (updatedStock) {
                return true
            }
        }
        catch (e) {
            return false;
        }
    }

    async getStockByName(name: String): Promise<StockEntity> {
        const stockEntity: StockEntity = await this.stockRepository.findOne({ where: `"name" ILIKE '${name}'`});
        return stockEntity;
    }

    async getStockByID(id: number): Promise<StockEntity> {
        const stockEntity: StockEntity = await this.stockRepository.findOne(id);
        return stockEntity;
    }

}
