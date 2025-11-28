import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  DeleteDateColumn 
} from "typeorm";

@Entity({ name: "products" })
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column("decimal", { precision: 10, scale: 2 })
    price!: number;

    @Column("text")
    description!: string;

    @Column({ default: 0 })
    quantity!: number;

    @Column({ default: true })
    isAvailable!: boolean;

    @Column("simple-array", { nullable: true })
    images!: string[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}