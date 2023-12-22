import { USER_ROLE } from '@app/constants/Common';
import { COURSE_ROUTES } from '@app/constants/CourseConstant';
import {
  addAnswer,
  addQuestion,
  addReplyToReview,
  addReview,
  deleteCourse,
  editCourse,
  getAllCourses,
  getAllCoursesForAdmin,
  getCourseByUser,
  getSingleCourse,
  uploadCourse
} from '@app/controllers/Course.controller';
import { authorizeRoles, isAuthenticated } from '@app/middleware/Auth';
import express from 'express';
const courseRouter = express.Router();

courseRouter.post(COURSE_ROUTES.CREATE_COURSE, isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), uploadCourse);
courseRouter.put(COURSE_ROUTES.EDIT_COURSE, isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), editCourse);
courseRouter.get(COURSE_ROUTES.GET_SINGLE_COURSE, getSingleCourse);
courseRouter.get(COURSE_ROUTES.GET_ALL_COURSES, getAllCourses);
courseRouter.get(COURSE_ROUTES.GET_CONTENT_COURSE, isAuthenticated, getCourseByUser);
courseRouter.post(COURSE_ROUTES.ADD_QUESTION, isAuthenticated, addQuestion);
courseRouter.put(COURSE_ROUTES.ADD_ANSWER, isAuthenticated, addAnswer);
courseRouter.put(COURSE_ROUTES.ADD_REVIEW, isAuthenticated, addReview);
courseRouter.put(COURSE_ROUTES.ADD_REPLY, isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), addReplyToReview);
courseRouter.put(COURSE_ROUTES.DELETE_COURSE, isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), deleteCourse);
courseRouter.get(
  COURSE_ROUTES.GET_ALL_COURSES_FOR_ADMIN,
  isAuthenticated,
  authorizeRoles(USER_ROLE.ADMIN),
  getAllCoursesForAdmin
);

export default courseRouter;
