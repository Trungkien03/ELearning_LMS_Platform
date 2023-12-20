import { USER_ROLE } from '@app/constants/Common';
import {
  addAnswer,
  addQuestion,
  addReplyToReview,
  addReview,
  editCourse,
  getAllCourses,
  getCourseByUser,
  getSingleCourse,
  uploadCourse
} from '@app/controllers/Course.controller';
import { authorizeRoles, isAuthenticated } from '@app/middleware/Auth';
import express from 'express';
const courseRouter = express.Router();

courseRouter.post('/create-course', isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), uploadCourse);
courseRouter.put('/edit-course/:id', isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), editCourse);
courseRouter.get('/get-course/:id', getSingleCourse);
courseRouter.get('/get-courses', getAllCourses);
courseRouter.get('/get-course-content/:id', isAuthenticated, getCourseByUser);
courseRouter.post('/add-question', isAuthenticated, addQuestion);
courseRouter.put('/add-answer', isAuthenticated, addAnswer);
courseRouter.put('/add-review/:id', isAuthenticated, addReview);
courseRouter.put('/add-reply', isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), addReplyToReview);

export default courseRouter;
