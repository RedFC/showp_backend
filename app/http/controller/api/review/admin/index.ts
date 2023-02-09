import express from 'express';
import { AuthenticationMiddleware } from '../../../../middleware/auth';
export const reviewAdminRouter = express.Router();

import { RoleMiddleware } from '../../../../middleware/role';
import { ValidationMiddleware } from '../../../../middleware/validation';
import { Review } from './review.admin.controller'

let review_controller = new Review();
let validation_controller = new ValidationMiddleware()
let auth_controller = new AuthenticationMiddleware()
let role_controller = new RoleMiddleware()
