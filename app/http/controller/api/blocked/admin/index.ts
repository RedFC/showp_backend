import express from 'express';
import { AuthenticationMiddleware } from '../../../../middleware/auth';
export const blockedAdminRouter = express.Router();

import { RoleMiddleware } from '../../../../middleware/role';
import { ValidationMiddleware } from '../../../../middleware/validation';
import { Blocked } from './blocked.admin.controller'

let blocked_controller = new Blocked();
let validation_controller = new ValidationMiddleware()
let auth_controller = new AuthenticationMiddleware()
let role_controller = new RoleMiddleware()