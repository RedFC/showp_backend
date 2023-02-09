import express from 'express';
import { AuthenticationMiddleware } from '../../../middleware/auth';
export const orderRouter = express.Router();

import { RoleMiddleware } from '../../../middleware/role';
import { ValidationMiddleware } from '../../../middleware/validation';
import { Order } from './order.controller'
import { CacheMiddleware } from '../../../middleware/cache';

let order_controller = new Order();
let validation_controller = new ValidationMiddleware()
let cache_controller = new CacheMiddleware()
let auth_controller = new AuthenticationMiddleware()
let role_controller = new RoleMiddleware()

orderRouter.post('/',auth_controller.isAuthenticated(),validation_controller.validateOrders(),order_controller.create);
orderRouter.get('/listing',auth_controller.isAuthenticated(),order_controller.orderListing);
orderRouter.put('/update_status/:id',auth_controller.isAuthenticated(),validation_controller.validateOrderUpdate(),order_controller.orderStatusUpdate);