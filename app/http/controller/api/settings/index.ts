import express from 'express';
import { AuthenticationMiddleware } from '../../../middleware/auth';
export const settingsRouter = express.Router();

import { RoleMiddleware } from '../../../middleware/role';
import { ValidationMiddleware } from '../../../middleware/validation';
import { Settings } from './settings.controller'
import { CacheMiddleware } from '../../../middleware/cache';

let setting_controller = new Settings();
let validation_controller = new ValidationMiddleware()
let cache_controller = new CacheMiddleware()
let auth_controller = new AuthenticationMiddleware()
let role_controller = new RoleMiddleware()

settingsRouter.get('/terms',
  auth_controller.isAuthenticated(),
  validation_controller.validateProductCreate(),
  setting_controller.getTerms)

settingsRouter.get('/aboutus',
  auth_controller.isAuthenticated(),
  validation_controller.validateProductCreate(),
  setting_controller.getAboutus)
