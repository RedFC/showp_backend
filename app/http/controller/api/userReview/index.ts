import express from 'express';
import { AuthenticationMiddleware } from '../../../middleware/auth';
export const UserReviewRouter = express.Router();

import { upload } from "../../../../constants/multer";
import { RoleMiddleware } from '../../../middleware/role';
import { ValidationMiddleware } from '../../../middleware/validation';
import { Review } from './review.controller'
import { CacheMiddleware } from '../../../middleware/cache';

let review_controller = new Review();
let validation_controller = new ValidationMiddleware()
let cache_controller = new CacheMiddleware()
let auth_controller = new AuthenticationMiddleware()
let role_controller = new RoleMiddleware()

UserReviewRouter.post('/:id',
    auth_controller.isAuthenticated(),
    validation_controller.ValidateSellerReview(),
    review_controller.create
);
    
UserReviewRouter.get('/:id',
    auth_controller.isAuthenticated(),
    review_controller.getAll
);
UserReviewRouter.patch('/:id',
    auth_controller.isAuthenticated(),
    validation_controller.ValidateSellerReviewUpdate(),
    review_controller.updateReview
)

UserReviewRouter.delete('/:id',
    auth_controller.isAuthenticated(),
    review_controller.deleteReview
);
