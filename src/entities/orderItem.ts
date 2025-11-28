import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from "typeorm";
import { Order } from "./order";
import { Product } from "./product";

@Entity({ name: "order_items" })
export class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Order, order => order.items)
  order!: Order;

  @ManyToOne(() => Product)
  product!: Product;

  @Column()
  productName!: string;

  @Column()
  quantity!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  unitPrice!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  total!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}