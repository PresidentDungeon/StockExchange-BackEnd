import { Module } from '@nestjs/common';
import {IStockServiceProvider} from "../core/primary-ports/stock.service.interface";
import {StockService} from "../core/services/stock.service";
import { StockGateway } from './gateways/stock.gateway';
import {TypeOrmModule} from "@nestjs/typeorm";
import StockEntity from "../infrastructure/data-source/entities/stock.entity";
import {StockController} from "./controllers/stock.controller";

@Module({
    imports: [TypeOrmModule.forFeature([StockEntity])],
    providers: [StockGateway, {provide: IStockServiceProvider, useClass: StockService}],
    exports: [IStockServiceProvider],
    controllers: [StockController]
})
export class StockModule {}
