import express from 'express';
import { AuthenticationMiddleware } from '../../../../middleware/auth';
export const tncAdminRouter = express.Router();

import { RoleMiddleware } from '../../../../middleware/role';
import { ValidationMiddleware } from '../../../../middleware/validation';
import { TermsAConditions } from './tnc.admin.controller'

let tnc_controller = new TermsAConditions();
let validation_controller = new ValidationMiddleware()
let auth_controller = new AuthenticationMiddleware()
let role_controller = new RoleMiddleware()

tncAdminRouter.post('/',
    auth_controller.isAuthenticated(),
    role_controller.isAdmin(),
    validation_controller.validateTermsAndCondition(),
    tnc_controller.createOrUpdate
);

tncAdminRouter.get('/',
    auth_controller.isAuthenticated(),
    role_controller.isAdmin(),
    tnc_controller.get
);

