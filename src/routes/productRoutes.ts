import { Router } from 'express';
import { productController } from '../controllers/productController';
import { upload } from '../middleware/upload';

const router = Router();


router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);


router.post('/:id/images', upload.array('images', 5), productController.uploadImages);
router.delete('/:id/images/:imageName', productController.deleteImage);

export default router;