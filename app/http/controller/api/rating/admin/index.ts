import express from 'express';
import { AuthenticationMiddleware } from '../../../../middleware/auth';
export const ratingAdminRouter = express.Router();

import { RoleMiddleware } from '../../../../middleware/role';
import { ValidationMiddleware } from '../../../../middleware/validation';
import { Rating } from './rating.admin.controller'

let rating_controller = new Rating();
let validation_controller = new ValidationMiddleware()
let auth_controller = new AuthenticationMiddleware()
let role_controller = new RoleMiddleware()