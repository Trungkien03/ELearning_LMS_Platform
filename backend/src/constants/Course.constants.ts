export enum COURSE_FIELD {
  NAME = 'Course Name',
  DESCRIPTION = 'Course Description',
  PRICE = 'Course Price',
  TAGS = 'Course Tags',
  LEVEL = 'Course Level',
  DEMO_URL = 'Course Demo Url'
}

export enum ORDER_SCHEMA_FIELD {
  COURSED_ID = 'courseId',
  USER_ID = 'userId',
  PAYMENT = 'paymentInfo'
}

export enum COURSE_ROUTES {
  CREATE_COURSE = '/create-course',
  EDIT_COURSE = '/edit-course/:id',
  GET_SINGLE_COURSE = '/get-course/:id',
  GET_ALL_COURSES = '/get-courses',
  GET_CONTENT_COURSE = '/get-course-content/:id',
  ADD_QUESTION = '/add-question',
  ADD_ANSWER = '/add-answer',
  ADD_REVIEW = '/add-review/:id',
  ADD_REPLY = '/add-reply',
  GET_ALL_COURSES_FOR_ADMIN = '/get-courses-admin',
  DELETE_COURSE = '/delete-course/:id'
}
