import { editCourse, uploadCourse } from '../controllers/Course.controller';
import { USER_ROLE } from './../constants/Common';
import { authorizeRoles, isAuthenticated } from './../middleware/Auth';
import express from 'express';
const courseRouter = express.Router();

courseRouter.post('/create-course', isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), uploadCourse);
courseRouter.put('/edit-course/:id', isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), editCourse);
export default courseRouter;
