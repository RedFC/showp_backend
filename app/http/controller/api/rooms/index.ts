import express from 'express';
import { AuthenticationMiddleware } from '../../../middleware/auth';
export const roomRouter = express.Router();
import { RoleMiddleware } from '../../../middleware/role';
import { ValidationMiddleware } from '../../../middleware/validation';
import { CacheMiddleware } from '../../../middleware/cache';
import { RoomClass } from './room.controller'

let validation_controller = new ValidationMiddleware()
let cache_controller = new CacheMiddleware()
let auth_controller = new AuthenticationMiddleware()
let role_controller = new RoleMiddleware()
let room_controller = new RoomClass();

roomRouter.post('/',
    auth_controller.isAuthenticated(),
    room_controller.createRoom
);

roomRouter.get('/list',
    auth_controller.isAuthenticated(),
    room_controller.getFriendList
);

roomRouter.post('/send/:id',
    auth_controller.isAuthenticated(),
    room_controller.sendMsg
);

roomRouter.get('/message/:id',
    auth_controller.isAuthenticated(),
    room_controller.getMsg
);