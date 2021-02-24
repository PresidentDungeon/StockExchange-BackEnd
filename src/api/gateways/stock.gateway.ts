import {SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Inject} from "@nestjs/common";
import {IStockService, IStockServiceProvider} from "../../core/primary-ports/stock.service.interface";

@WebSocketGateway()
export class StockGateway {

  @WebSocketServer() server;

  constructor( @Inject(IStockServiceProvider) private stockService: IStockService) {}

}
