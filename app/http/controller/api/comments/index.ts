import express from 'express';
import { AuthenticationMiddleware } from '../../../middleware/auth';
export const commentsRouter = express.Router();

import { RoleMiddleware } from '../../../middleware/role';
import { ValidationMiddleware } from '../../../middleware/validation';
import { Comments } from './comments.controller'
import { CacheMiddleware } from '../../../middleware/cache';

let comments_controller = new Comments();
let validation_controller = new ValidationMiddleware()
let cache_controller = new CacheMiddleware()
let auth_controller = new AuthenticationMiddleware()
let role_controller = new RoleMiddleware()

    commentsRouter.post('/',validation_controller.validateCommentCreate(),auth_controller.isAuthenticated(), 
    comments_controller.create);

    commentsRouter.put('/:id',validation_controller.validateCommentUpdate(),auth_controller.isAuthenticated(), 
    comments_controller.update);
    
    commentsRouter.delete('/:id',validation_controller.validateCommentFind(),auth_controller.isAuthenticated(),comments_controller.delete);
