import { USER_ROLE } from '@app/constants/Common.constants';
import { LAYOUT_ROUTES } from '@app/constants/Layout.constants';
import { createLayout, editLayout, getLayoutByType } from '@app/controllers/Layout.controller';
import { authorizeRoles, isAuthenticated } from '@app/middleware/Auth';
import express from 'express';
const layoutRouter = express.Router();

layoutRouter.post(LAYOUT_ROUTES.CREATE, isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), createLayout);
layoutRouter.put(LAYOUT_ROUTES.EDIT, isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), editLayout);
layoutRouter.post(LAYOUT_ROUTES.GET_LAYOUT, isAuthenticated, getLayoutByType);

export default layoutRouter;
