import { Module } from '@nestjs/common';
import {IStockServiceProvider} from "../core/primary-ports/stock.service.interface";
import {StockService} from "../core/services/stock.service";
import { StockGateway } from './gateways/stock.gateway';
import {TypeOrmModule} from "@nestjs/typeorm";
import StockEntity from "../../entities/stock.entity";

@Module({
    imports: [TypeOrmModule.forFeature([StockEntity])],
    providers: [StockGateway, {provide: IStockServiceProvider, useClass: StockService}],
    exports: [IStockServiceProvider]
})
export class StockModule {}
