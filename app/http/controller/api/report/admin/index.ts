import express from 'express';
import { AuthenticationMiddleware } from '../../../../middleware/auth';
export const reportAdminRouter = express.Router();

import { RoleMiddleware } from '../../../../middleware/role';
import { ValidationMiddleware } from '../../../../middleware/validation';
import { Report } from './report.admin.controller'

let report_controller = new Report();
let validation_controller = new ValidationMiddleware()
let auth_controller = new AuthenticationMiddleware()
let role_controller = new RoleMiddleware()

reportAdminRouter.put('/',auth_controller.isAuthenticated(),role_controller.isAdmin(),validation_controller.validateReportget(),report_controller.HandelReportRequest)