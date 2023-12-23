import { USER_ROLE } from '@app/constants/Common.constants';
import { LAYOUT_ROUTES } from '@app/constants/Layout.constants';
import { createLayout } from '@app/controllers/Layout.controller';
import { authorizeRoles, isAuthenticated } from '@app/middleware/Auth';
import express from 'express';
const layoutRouter = express.Router();

layoutRouter.post(LAYOUT_ROUTES.CREATE, isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), createLayout);

export default layoutRouter;
