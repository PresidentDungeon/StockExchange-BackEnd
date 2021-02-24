import { Injectable } from '@nestjs/common';
import {IStockService} from "../primary-ports/stock.service.interface";
import {Stock} from "../models/stock";
import {InjectRepository} from "@nestjs/typeorm";
import StockEntity from "../../../entities/stock.entity";
import {Repository} from "typeorm";

@Injectable()
export class StockService implements IStockService{

    constructor(
        @InjectRepository(StockEntity)
        private stockRepository: Repository<StockEntity>
    ) {}


    private stocks: Stock[] = []

}
