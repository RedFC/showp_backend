import express from 'express';
import { AuthenticationMiddleware } from '../../../middleware/auth';
export const tncRouter = express.Router();

import { RoleMiddleware } from '../../../middleware/role';
import { ValidationMiddleware } from '../../../middleware/validation';
import { TermsAConditions } from './tnc.controller'
import { CacheMiddleware } from '../../../middleware/cache';

let tnc_controller = new TermsAConditions();
let validation_controller = new ValidationMiddleware()
let cache_controller = new CacheMiddleware()
let auth_controller = new AuthenticationMiddleware()
let role_controller = new RoleMiddleware()