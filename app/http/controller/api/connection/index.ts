import express from 'express';
import { AuthenticationMiddleware } from '../../../middleware/auth';
export const connectionRouter = express.Router();

import { RoleMiddleware } from '../../../middleware/role';
import { ValidationMiddleware } from '../../../middleware/validation';
import { Connection } from './connection.controller'
import { CacheMiddleware } from '../../../middleware/cache';

let connection_controller = new Connection();
let validation_controller = new ValidationMiddleware()
let auth_controller = new AuthenticationMiddleware()

connectionRouter.get("/getconnections/:id", auth_controller.isAuthenticated(), connection_controller.get);
connectionRouter.get("/getAll", auth_controller.isAuthenticated(), connection_controller.getAll);

connectionRouter.get("/:id", auth_controller.isAuthenticated(), connection_controller.get);

connectionRouter.post("/follow", auth_controller.isAuthenticated(), validation_controller.validateConnectionFollow(), connection_controller.follow);

connectionRouter.post("/accept", auth_controller.isAuthenticated(), validation_controller.validateAcceptFlow(), connection_controller.acceptRequest);

connectionRouter.post("/unfollow", auth_controller.isAuthenticated(), validation_controller.validateConnectionFollow(), connection_controller.unfollow);

connectionRouter.get("/getrequests", auth_controller.isAuthenticated(),connection_controller.getRequests);