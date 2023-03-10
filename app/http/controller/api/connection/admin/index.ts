import express from 'express';
import { AuthenticationMiddleware } from '../../../../middleware/auth';
export const connectionAdminRouter = express.Router();

import { RoleMiddleware } from '../../../../middleware/role';
import { ValidationMiddleware } from '../../../../middleware/validation';
import { Connection } from './connection.admin.controller'

let connection_controller = new Connection();
let validation_controller = new ValidationMiddleware()
let auth_controller = new AuthenticationMiddleware()
let role_controller = new RoleMiddleware()