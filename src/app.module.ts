import { Module } from '@nestjs/common';
import { StockModule } from './stock/api/stock.module';
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from './stock/infrastructure/data-source/postgres/database.module';
import { StockController } from './stock/api/controllers/stock.controller';
import { DatabaseMongoModule } from './stock/infrastructure/data-source/mongoDB/database-mongo.module';
import { StockMongoService } from './stock/core/services/stock-mongo.service';
import * as Joi from '@hapi/joi';

@Module({
  imports: [StockModule, ConfigModule.forRoot({
    validationSchema: Joi.object({
      POSTGRES_HOST: Joi.string().required(),
      POSTGRES_PORT: Joi.number().required(),
      POSTGRES_USER: Joi.string().required(),
      POSTGRES_PASSWORD: Joi.string().required(),
      POSTGRES_DB: Joi.string().required(),
      PORT: Joi.number(),
    })
  }), DatabaseModule, DatabaseMongoModule
  ],
  controllers: [StockController],
  providers: []
})

export class AppModule {}
