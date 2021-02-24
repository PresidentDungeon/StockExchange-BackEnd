import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StockModule } from './api/stock.module';
import { StockService } from './core/services/stock.service';

@Module({
  imports: [StockModule],
  controllers: [AppController],
  providers: [AppService, StockService],
})
export class AppModule {}
