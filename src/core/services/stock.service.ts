import { Injectable } from '@nestjs/common';
import {IStockService} from "../primary-ports/stock.service.interface";

@Injectable()
export class StockService implements IStockService{

}
