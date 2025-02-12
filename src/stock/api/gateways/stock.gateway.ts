import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Inject} from "@nestjs/common";
import {IStockService, IStockServiceProvider} from "../../core/primary-ports/stock.service.interface";
import {Socket} from "socket.io";
import {interval, Subscription} from "rxjs";
import {StockEntity} from "../../infrastructure/data-source/entities/stock.entity";

@WebSocketGateway()
export class StockGateway {

  @WebSocketServer() server;
  stockupdateCheck: Subscription;

  constructor(@Inject(IStockServiceProvider) private stockService: IStockService) {
    const source = interval(300000);
    this.stockupdateCheck = source.subscribe(val => this.verifyStockDate());
  }

  @SubscribeMessage('createStock')
  async handleRegisterEvent(@MessageBody() stock: StockEntity, @ConnectedSocket() client: Socket) {

    let existingStock: StockEntity = await this.stockService.getStockByName(stock.name);
    if (existingStock) {
      client.emit('createResponse', {created: false, errorMessage: 'Stock with same name already exists'});
    } else {

      try{
        await this.stockService.createStock(stock);
        this.server.emit('stockCreateChanged');
        client.emit('createResponse', {created: true, errorMessage: ''});
      }
      catch (e){
        client.emit('createResponse', {created: false, errorMessage: 'Error saving stock to database'})
      }
    }
  }

  @SubscribeMessage('updateStock')
  async handleUpdateEvent(@MessageBody() stock: StockEntity, @ConnectedSocket() client: Socket) {

    let existingStock: StockEntity = await this.stockService.getStockByID(stock.id);

    if (existingStock) {
      try{
        await this.stockService.updateStock(stock);
        client.broadcast.emit('stockUpdateChanged', stock);
        client.emit('updateResponse', {updated: true, errorMessage: '', stock: stock});
      }
      catch (e){
        client.emit('updateResponse', {updated: false, errorMessage: 'Error updating stock in database'})
      }
    } else {
      client.emit('updateResponse', {updated: false, errorMessage: 'Stock could not be found in database'})
    }
  }


  @SubscribeMessage('deleteStock')
  async handleDeleteEvent(@MessageBody() stock: StockEntity, @ConnectedSocket() client: Socket) {

    let existingStock: StockEntity = await this.stockService.getStockByID(stock.id);

    if (existingStock) {
      try{
        await this.stockService.deleteStock(stock);
        client.broadcast.emit('stockDeleteChanged', stock);
        client.emit('deleteResponse', {deleted: true, errorMessage: '', stock: stock});
      }
      catch (e) {
        client.emit('deleteResponse', {deleted: false, errorMessage: 'Stock could not be found in database'})
      }
    } else {
      client.emit('deleteResponse', {deleted: false, errorMessage: 'Error updating stock in database'})
    }
  }

  @SubscribeMessage('verifyStockInitial')
  async handleVerifyInitialEvent(@ConnectedSocket() client: Socket) {
    let updated: boolean = await this.stockService.verifyStock();
    if(updated){client.broadcast.emit("stockDailyUpdate");}
    {client.emit("stockCreateChanged");}
  }

  async verifyStockDate() {
    let updated: boolean = await this.stockService.verifyStock();
    if(updated){this.server.emit("stockDailyUpdate");}
  }


  handleConnection(client: Socket, ...args: any[]): any {
  }

  handleDisconnect(client: Socket): any {
  }

}
