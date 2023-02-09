import express from 'express';
import { AuthenticationMiddleware } from '../../../middleware/auth';
export const ratingRouter = express.Router();

import { RoleMiddleware } from '../../../middleware/role';
import { ValidationMiddleware } from '../../../middleware/validation';
import { Rating } from './rating.controller'
import { CacheMiddleware } from '../../../middleware/cache';

let rating_controller = new Rating();
let validation_controller = new ValidationMiddleware()
let cache_controller = new CacheMiddleware()
let auth_controller = new AuthenticationMiddleware()
let role_controller = new RoleMiddleware()