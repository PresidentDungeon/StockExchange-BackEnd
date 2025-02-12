import {Body, Controller, Get, Inject, Post, Query} from '@nestjs/common';
import {IStockService, IStockServiceProvider} from "../../core/primary-ports/stock.service.interface";
import {Filter} from "../../core/models/filter";

@Controller('stock')
export class StockController {

    constructor( @Inject(IStockServiceProvider) private stockService: IStockService) {}

    @Post()
    GetMessages(@Body() filter: Filter): any{
        return this.stockService.getStock(filter);
    }

    @Get()
    GetStockByID(@Query() ID?: any): any{
        const stock = this.stockService.getStockByID(ID.ID);
        return stock;
    }
}
