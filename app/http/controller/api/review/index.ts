import express from 'express';
import { AuthenticationMiddleware } from '../../../middleware/auth';
export const reviewRouter = express.Router();
import { upload } from "../../../../constants/multer";
import { RoleMiddleware } from '../../../middleware/role';
import { ValidationMiddleware } from '../../../middleware/validation';
import { Review } from './review.controller'
import { CacheMiddleware } from '../../../middleware/cache';
import { auth } from 'google-auth-library';
let review_controller = new Review();
let validation_controller = new ValidationMiddleware()
let cache_controller = new CacheMiddleware()
let auth_controller = new AuthenticationMiddleware()
let role_controller = new RoleMiddleware()

reviewRouter.post('/:id',
    auth_controller.isAuthenticated(),
    upload.single('video'),
    validation_controller.validateRatingAndReviewsCreate(),
    validation_controller.validateIncomingFile(),
    validation_controller.validateReview(),
    review_controller.create);

reviewRouter.get('/',
    auth_controller.isAuthenticated(),
    review_controller.getAll
);
reviewRouter.get('/findAllByUser',
    auth_controller.isAuthenticated(),
    review_controller.getAlByUserId);

reviewRouter.post('/like/:id',
    auth_controller.isAuthenticated(),
    validation_controller.validateReviewLikeParams(),
    review_controller.createReviewLike
);
reviewRouter.get('/random',
    auth_controller.openApiKeyValidate(),
    review_controller.getRandom);

reviewRouter.get('/following',
    auth_controller.isAuthenticated(),
    review_controller.followingReviews);

reviewRouter.get('/foryou',
    auth_controller.isAuthenticated(),
    review_controller.foryou);


