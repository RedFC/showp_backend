import express from 'express';
import { AuthenticationMiddleware } from '../../../middleware/auth';
export const userRouter = express.Router();

import { upload } from "../../../../constants/multer";
import { RoleMiddleware } from '../../../middleware/role';
import { ValidationMiddleware } from '../../../middleware/validation';
import { User } from './user.controller'
import { CacheMiddleware } from '../../../middleware/cache';

let user_controller = new User();
let validation_controller = new ValidationMiddleware()
let cache_controller = new CacheMiddleware()
let auth_controller = new AuthenticationMiddleware()
let role_controller = new RoleMiddleware()

userRouter.post('/', auth_controller.isAuthenticated(), role_controller.isUser(), validation_controller.validateUserUpdate(), upload.fields([{ name: "image" }]), user_controller.update);

userRouter.get('/', cache_controller.userSearch(), user_controller.get)

userRouter.post('/isexists',validation_controller.validateToken(),user_controller.Exists)

userRouter.post('/register', upload.array('images'),validation_controller.validateUserRegistration(),validation_controller.validateToken(), user_controller.register);

userRouter.post('/social/register', upload.array('images'),validation_controller.validateUserRegistration(),validation_controller.validateToken(),user_controller.social_register);

// userRouter.post('/login', validation_controller.validateUserLogin(), user_controller.login);

userRouter.post('/verify', validation_controller.validateUserVerify(), user_controller.verify);

userRouter.post('/logout', auth_controller.isAuthenticated(), user_controller.logout)

userRouter.post('/verify_token', auth_controller.isAuthenticated(), (req,res) => {
  res.send({
    status: true,
    msg: "Refresh Token Record Updated"
  })
})

userRouter.post("/delete_data",(req,res) => {res.send("Your data will be deleted shortly")})
userRouter.post('/returnPolicies', auth_controller.isAuthenticated(),validation_controller.validateReturnPolicy(),user_controller.createReturnPolicy)
userRouter.get('/returnPolicies', auth_controller.isAuthenticated(),user_controller.getReturnPolicy)