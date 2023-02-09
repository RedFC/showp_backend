import express from 'express';
import { AuthenticationMiddleware } from '../../../../middleware/auth';
export const AdminsettingsRouter = express.Router();

import { RoleMiddleware } from '../../../../middleware/role';
import { ValidationMiddleware } from '../../../../middleware/validation';
import { AdminSettings } from './settings.admin.controller'
import { CacheMiddleware } from '../../../../middleware/cache';

let adminsetting_controller = new AdminSettings();
let validation_controller = new ValidationMiddleware()
let cache_controller = new CacheMiddleware()
let auth_controller = new AuthenticationMiddleware()
let role_controller = new RoleMiddleware()

AdminsettingsRouter.post('/terms',
  auth_controller.isAuthenticated(),
  role_controller.isAdmin,
  adminsetting_controller.createTerms)

AdminsettingsRouter.post('/aboutus/',
  auth_controller.isAuthenticated(),
  role_controller.isAdmin,
  adminsetting_controller.createAboutus)
