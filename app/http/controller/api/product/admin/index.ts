import express from 'express';
import { AuthenticationMiddleware } from '../../../../middleware/auth';
export const productAdminRouter = express.Router();

import { RoleMiddleware } from '../../../../middleware/role';
import { ValidationMiddleware } from '../../../../middleware/validation';
import { Product } from './product.admin.controller'

let product_controller = new Product();
let validation_controller = new ValidationMiddleware()
let auth_controller = new AuthenticationMiddleware()
let role_controller = new RoleMiddleware()

productAdminRouter.put('/:id',auth_controller.isAuthenticated(),role_controller.isAdmin(),product_controller.BlockUnblockProduct);
 