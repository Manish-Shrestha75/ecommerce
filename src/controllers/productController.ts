import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Product } from '../entities/product';
import fs from 'fs';
import path from 'path';

const productRepository = AppDataSource.getRepository(Product);

export const productController = {
    // GET all products
    getAllProducts: async (req: Request, res: Response) => {
        try {
            const products = await productRepository.find();
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching products' });
        }
    },

    // GET single product
    getProductById: async (req: Request, res: Response) => {
        try {
            const product = await productRepository.findOne({
                where: { id: req.params.id }
            });
            
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            
            res.json(product);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching product' });
        }
    },

  
    createProduct: async (req: Request, res: Response) => {
        try {
            
            if (!req.body.name || !req.body.price || !req.body.description) {
                return res.status(400).json({ 
                    message: 'Missing required fields: name, price, description' 
                });
            }

           
            const productData = {
                name: req.body.name,
                price: parseFloat(req.body.price),
                description: req.body.description,
                quantity: parseInt(req.body.quantity) || 0,
                isAvailable: req.body.isAvailable !== 'false',
                images: req.files ? (req.files as Express.Multer.File[]).map(file => file.filename) : []
            };

            const product = productRepository.create(productData);
            const result = await productRepository.save(product);
            
            res.status(201).json(result);
            
        } catch (error) {
           
            if (req.files) {
                (req.files as Express.Multer.File[]).forEach(file => {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                });
            }
            
            res.status(500).json({ message: 'Error creating product' });
        }
    },

   
    updateProduct: async (req: Request, res: Response) => {
        try {
            const product = await productRepository.findOne({
                where: { id: req.params.id }
            });
            
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            const updateData = {
                ...req.body,
                price: req.body.price ? parseFloat(req.body.price) : product.price,
                quantity: req.body.quantity ? parseInt(req.body.quantity) : product.quantity
            };
            
            productRepository.merge(product, updateData);
            const result = await productRepository.save(product);
            
            res.json(result);
            
        } catch (error) {
            res.status(500).json({ message: 'Error updating product' });
        }
    },

   
    deleteProduct: async (req: Request, res: Response) => {
        try {
            const product = await productRepository.findOne({
                where: { id: req.params.id }
            });
            
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            
            if (product.images && product.images.length > 0) {
                product.images.forEach(imageName => {
                    const imagePath = path.join('uploads', imageName);
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                });
            }

            await productRepository.softDelete(req.params.id);
            res.status(204).send();
            
        } catch (error) {
            res.status(500).json({ message: 'Error deleting product' });
        }
    },

    // UPLOAD product images
    uploadImages: async (req: Request, res: Response) => {
        try {
            const product = await productRepository.findOne({
                where: { id: req.params.id }
            });
            
            if (!product) {
                
                if (req.files) {
                    (req.files as Express.Multer.File[]).forEach(file => {
                        if (fs.existsSync(file.path)) {
                            fs.unlinkSync(file.path);
                        }
                    });
                }
                return res.status(404).json({ message: 'Product not found' });
            }

            const newImages = (req.files as Express.Multer.File[]).map(file => file.filename);
            product.images = [...(product.images || []), ...newImages];
            
            const result = await productRepository.save(product);
            res.json(result);
            
        } catch (error) {
           
            if (req.files) {
                (req.files as Express.Multer.File[]).forEach(file => {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                });
            }
            res.status(500).json({ message: 'Error uploading images' });
        }
    },

    // DELETE product image
    deleteImage: async (req: Request, res: Response) => {
        try {
            const product = await productRepository.findOne({
                where: { id: req.params.id }
            });
            
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            if (!product.images || product.images.length === 0) {
                return res.status(404).json({ message: 'No images found for this product' });
            }

            const imageIndex = product.images.indexOf(req.params.imageName);
            if (imageIndex === -1) {
                return res.status(404).json({ message: 'Image not found' });
            }

            const imagePath = path.join('uploads', req.params.imageName);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

       
            product.images.splice(imageIndex, 1);
            const result = await productRepository.save(product);
            
            res.json({ message: 'Image deleted successfully', product: result });
            
        } catch (error) {
            res.status(500).json({ message: 'Error deleting image' });
        }
    }
};