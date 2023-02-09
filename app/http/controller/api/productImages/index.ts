import express from 'express';
import { AuthenticationMiddleware } from '../../../middleware/auth';
export const productRouter = express.Router();

import { RoleMiddleware } from '../../../middleware/role';
import { ValidationMiddleware } from '../../../middleware/validation';
import { ProductImages } from './productImages.controller'
import { CacheMiddleware } from '../../../middleware/cache';

let productImages_controller = new ProductImages();
let validation_controller = new ValidationMiddleware()
let cache_controller = new CacheMiddleware()
let auth_controller = new AuthenticationMiddleware()
let role_controller = new RoleMiddleware()
