import { Module } from '@nestjs/common';
import {IStockServiceProvider} from "../core/primary-ports/stock.service.interface";
import {StockService} from "../core/services/stock.service";
import { StockGateway } from './gateways/stock.gateway';

@Module({
    providers: [StockGateway, {provide: IStockServiceProvider, useClass: StockService}]
})
export class StockModule {}
