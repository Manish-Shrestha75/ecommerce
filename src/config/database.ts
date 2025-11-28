import { DataSource } from "typeorm";
import { Product } from "../entities/product";
import 'dotenv/config';

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "postgres", 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "ecommerce_db",
    entities: [Product],
    synchronize: true,
    logging: true,
});