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

      if (result) {
        this.server.emit('stockCreateChanged', 0);
        client.emit('createResponse', {created: true, errorMessage: ''});
      } else {
        client.emit('createResponse', {created: false, errorMessage: 'Error saving stock to database'})
      }
    }
  }


  @SubscribeMessage('updateStock')
  async handleUpdateEvent(@MessageBody() stock: StockEntity, @ConnectedSocket() client: Socket) {

    let existingStock: StockEntity = await this.stockService.getStockByID(stock.id);

    if (existingStock) {

      let result: boolean = await this.stockService.updateStock(stock);
      if (result) {
        this.server.emit('stockUpdateChanged', stock);
        client.emit('updateResponse', {updated: true, errorMessage: ''});
      } else {
        client.emit('updateResponse', {updated: false, errorMessage: 'Stock could not be found in database'})
      }
    } else {
      client.emit('updateResponse', {updated: false, errorMessage: 'Error updating stock in database'})
    }
  }

  @SubscribeMessage('deleteStock')
  async handleDeleteEvent(@MessageBody() stock: StockEntity, @ConnectedSocket() client: Socket) {

    let existingStock: StockEntity = await this.stockService.getStockByID(stock.id);

    if (existingStock) {

      let result: boolean = await this.stockService.deleteStock(stock);
      if (result) {
        this.server.emit('stockDeleteChanged', stock);
        client.emit('deleteResponse', {deleted: true, errorMessage: ''});
      } else {
        client.emit('deleteResponse', {deleted: false, errorMessage: 'Stock could not be found in database'})
      }
    } else {
      client.emit('deleteResponse', {deleted: false, errorMessage: 'Error updating stock in database'})
    }
  }

}
