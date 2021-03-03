import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class StockEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public description: string;

  @Column("decimal", { precision: 8, scale: 2 })
  public currentStockPrice: number;

  @Column("decimal", { precision: 8, scale: 2 })
  public dailyStockPrice: number;

  @Column()
  public dailyTimestamp: Date;
}

export default StockEntity;
