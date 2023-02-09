import express from 'express';
import { AuthenticationMiddleware } from '../../../middleware/auth';
export const productRouter = express.Router();

import { upload } from "../../../../constants/multer";
import { RoleMiddleware } from '../../../middleware/role';
import { ValidationMiddleware } from '../../../middleware/validation';
import { Product } from './product.controller'
import { CacheMiddleware } from '../../../middleware/cache';
import { ProductImages} from '../productImages/productImages.controller'

let product_controller = new Product();
let validation_controller = new ValidationMiddleware()
let cache_controller = new CacheMiddleware()
let auth_controller = new AuthenticationMiddleware()
let role_controller = new RoleMiddleware()

productRouter.post('/', auth_controller.isAuthenticated(),upload.array('images'),validation_controller.validateProductCreate(),product_controller.create)
productRouter.get('/', auth_controller.isAuthenticated(), product_controller.getAllproducts)
productRouter.get('/me', auth_controller.isAuthenticated(), product_controller.getMyproducts)
productRouter.get('/:id', auth_controller.isAuthenticated(), product_controller.getOneproducts)
productRouter.get('/search',cache_controller.productSearch(),product_controller.SearchProducts)
productRouter.put('/:id',auth_controller.isAuthenticated(),upload.array('images'),validation_controller.validateProductRecord(),validation_controller.validateProductUpdate(),product_controller.update)
productRouter.delete('/:id',auth_controller.isAuthenticated(),validation_controller.validateProductRecord(),product_controller.deleteProduct)