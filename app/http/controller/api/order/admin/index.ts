import express from 'express';
import { AuthenticationMiddleware } from '../../../../middleware/auth';
export const orderAdminRouter = express.Router();

import { RoleMiddleware } from '../../../../middleware/role';
import { ValidationMiddleware } from '../../../../middleware/validation';
import { Order } from './order.admin.controller'

let order_controller = new Order();
let validation_controller = new ValidationMiddleware()
let auth_controller = new AuthenticationMiddleware()
let role_controller = new RoleMiddleware()

orderAdminRouter.get('/getAll',
    auth_controller.isAuthenticated(),
    role_controller.isAdmin(),
    order_controller.getAll
);