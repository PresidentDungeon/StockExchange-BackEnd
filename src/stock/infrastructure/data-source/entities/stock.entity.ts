import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class StockEntity {

  @PrimaryColumn()
  public id: string;

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
