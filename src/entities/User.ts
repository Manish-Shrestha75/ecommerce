import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany
} from "typeorm";
import { Order } from "./order";

export enum AuthProvider {
  LOCAL = "local",
  GOOGLE = "google"
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive"
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user"
}

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: true })
  username!: string;

  @Column({ nullable: true })
  firstname!: string;

  @Column({ nullable: true })
  lastname!: string;

  @Column({ nullable: true })
  phoneNumber!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true, select: false })
  password!: string;

  @Column({
    type: "enum",
    enum: AuthProvider,
    default: AuthProvider.LOCAL
  })
  provider!: AuthProvider;

  @Column({ nullable: true })
  googleId!: string;

  @Column({ default: false })
  isVerified!: boolean;

  @Column({ nullable: true })
  verificationToken!: string;

  @Column({ nullable: true, type: "timestamp" })
  verificationExpires!: Date;

  @Column({ nullable: true })
  resetToken!: string;

  @Column({ nullable: true, type: "timestamp" })
  resetExpires!: Date;

  @Column({ nullable: true, default: 0 })
  resetCount!: number;

  @Column({
    type: "enum",
    enum: UserStatus,
    default: UserStatus.ACTIVE
  })
  status!: UserStatus;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER
  })
  role!: UserRole;

  @Column({ type: "int", default: 0 })
  loyaltyPoints!: number;

  @Column({ nullable: true })
  shippingStreet!: string;

  @Column({ nullable: true })
  shippingDistrict!: string;

  @Column({ nullable: true })
  shippingCity!: string;

  @Column({ nullable: true })
  shippingProvince!: string;

  @OneToMany(() => Order, order => order.user)
  orders!: Order[];

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt!: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deletedAt!: Date;
}