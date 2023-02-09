import express from 'express';
import { AuthenticationMiddleware } from '../../../middleware/auth';
export const reportRouter = express.Router();

import { RoleMiddleware } from '../../../middleware/role';
import { ValidationMiddleware } from '../../../middleware/validation';
import { Report } from './report.controller'
import { CacheMiddleware } from '../../../middleware/cache';

let report_controller = new Report();
let validation_controller = new ValidationMiddleware()
let cache_controller = new CacheMiddleware()
let auth_controller = new AuthenticationMiddleware()
let role_controller = new RoleMiddleware()

reportRouter.post('/', auth_controller.isAuthenticated(),validation_controller.validateReport(),report_controller.create);