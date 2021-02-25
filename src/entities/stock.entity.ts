import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class StockEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public currentStockPrice: number;

  @Column()
  public dailyStockPrice: number;

  @Column()
  public dailyTimestamp: Date;
}

export default StockEntity;
