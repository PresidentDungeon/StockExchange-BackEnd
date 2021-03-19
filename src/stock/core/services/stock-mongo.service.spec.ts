import { Test, TestingModule } from '@nestjs/testing';
import { StockMongoService } from './stock-mongo.service';

describe('StockServiceMongoService', () => {
  let service: StockMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockMongoService],
    }).compile();

    service = module.get<StockMongoService>(StockMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
