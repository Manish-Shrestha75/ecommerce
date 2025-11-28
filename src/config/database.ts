import { DataSource } from "typeorm";
import { Product } from "../entities/product";
import { User } from "../entities/User";
import { Order } from "../entities/order";
import { OrderItem } from "../entities/orderItem";
import 'dotenv/config';

// Debug: Check if environment variables are loaded
console.log("Database Config:", {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ? "***" : "MISSING",
    database: process.env.DB_NAME
});

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD, // Make sure this is a string
    database: process.env.DB_NAME || "ecommerce",
    entities: [Product, User, Order, OrderItem],
    synchronize: true,
    logging: true,
});