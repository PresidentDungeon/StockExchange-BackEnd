import { Module } from '@nestjs/common';
import {IStockServiceProvider} from "../core/primary-ports/stock.service.interface";
import {StockService} from "../core/services/stock.service";
import { StockGateway } from './gateways/stock.gateway';
import {TypeOrmModule} from "@nestjs/typeorm";
import {StockController} from "./controllers/stock.controller";
import {StockEntity} from "../infrastructure/data-source/postgres/entities/stock.entity";
import {DatabaseMongoModule} from "../infrastructure/data-source/mongoDB/database-mongo.module";
import {stocksProviders} from "../infrastructure/data-source/mongoDB/stocks.providers";
import {StockMongoService} from "../core/services/stock-mongo.service";
import {StockRepository} from "../infrastructure/data-source/mongoDB/stock.repository";
import {IStockRepositoryProvider} from "../core/primary-ports/stock.repository.interface";

@Module({
    imports: [TypeOrmModule.forFeature([StockEntity]), DatabaseMongoModule],
    providers: [StockGateway, {provide: IStockServiceProvider, useClass: StockService}, {provide: IStockRepositoryProvider, useClass: StockRepository}, ...stocksProviders],
    exports: [IStockServiceProvider],
    controllers: [StockController]
})
export class StockModule {}
