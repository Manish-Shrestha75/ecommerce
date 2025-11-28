import "reflect-metadata";
import express, { Express, Request, Response } from 'express';
import { AppDataSource } from './config/database';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';

const app: Express = express();
const port = process.env.PORT || 3000;


app.use(express.json());


AppDataSource.initialize()
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((error) => {
        console.log("Database connection error:", error);
    });


app.get('/', (req: Request, res: Response) => {
    res.json({ 
        message: 'Ecommerce API is running!',
        endpoints: {
            products: '/api/products'
        }
    });
});


app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});