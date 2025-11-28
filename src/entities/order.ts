import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany
} from "typeorm";
import { User } from "./User";
import { OrderItem } from "./orderItem";

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled"
}

@Entity({ name: "orders" })
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  orderNumber!: string;

  @ManyToOne(() => User, user => user.orders)
  user!: User;

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  items!: OrderItem[];

  @Column("decimal", { precision: 10, scale: 2 })
  subtotal!: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  tax!: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  shippingCost!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  total!: number;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  status!: OrderStatus;

  @Column()
  shippingAddress!: string;

  @Column()
  billingAddress!: string;

  @Column()
  customerName!: string;

  @Column()
  customerEmail!: string;

  @Column()
  customerPhone!: string;

  @Column({ nullable: true })
  paymentMethod!: string;

  @Column({ nullable: true })
  transactionId!: string;

  @Column({ nullable: true })
  notes!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}