import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Inject} from "@nestjs/common";
import {IStockService, IStockServiceProvider} from "../../core/primary-ports/stock.service.interface";
import StockEntity from "../../../entities/stock.entity";
import {Socket} from "socket.io";
import {Stock} from "../../core/models/stock";

@WebSocketGateway()
export class StockGateway {

  @WebSocketServer() server;

  constructor(@Inject(IStockServiceProvider) private stockService: IStockService) {
  }

  @SubscribeMessage('createStock')
  async handleRegisterEvent(@MessageBody() stock: StockEntity, @ConnectedSocket() client: Socket) {

    let existingStock: StockEntity = await this.stockService.getStockByName(stock.name);
    if (existingStock) {
      client.emit('createResponse', {created: false, errorMessage: 'Stock with same name already exists'});
    } else {
      let result: boolean = await this.stockService.createStock(stock);

      console.log(result);

      if (result) {
        this.server.emit('stockChanged');
        client.emit('createResponse', {created: true, errorMessage: ''});
      } else {
        client.emit('createResponse', {created: false, errorMessage: 'Error saving stock to database'})
      }
    }
  }




}
