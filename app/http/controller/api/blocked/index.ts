import express from 'express';
import { AuthenticationMiddleware } from '../../../middleware/auth';
export const blockedRouter = express.Router();

import { RoleMiddleware } from '../../../middleware/role';
import { ValidationMiddleware } from '../../../middleware/validation';
import { Blocked } from './blocked.controller'
import { CacheMiddleware } from '../../../middleware/cache';

let blocked_controller = new Blocked();
let validation_controller = new ValidationMiddleware()
let cache_controller = new CacheMiddleware()
let auth_controller = new AuthenticationMiddleware()
let role_controller = new RoleMiddleware()

blockedRouter.post('/block/:id',
  auth_controller.isAuthenticated(),
  validation_controller.validateBlockRequest(),
  role_controller.isUser(),
  blocked_controller.blockUser);

blockedRouter.get('/getMyblockedUsers',
  auth_controller.isAuthenticated(),
  role_controller.isUser(),
  blocked_controller.getMyBlockList);

blockedRouter.delete('/unBlockUser/:id',
  auth_controller.isAuthenticated(),
  validation_controller.validateBlockRequest(),
  role_controller.isUser(),
  blocked_controller.unBlockUser);
