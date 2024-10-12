/** @format */
// routes/courses.route.js
import express from 'express';
import courseControllers from '../controllers/course.controllers.js';
import verfiyToken from '../middleware/verfiyToken.js';

const router = express.Router();
router.route('/').get(courseControllers.getAllCourses);
router.route('/').post(verfiyToken, courseControllers.addCourse);
router.route('/:courseId').get(courseControllers.getCourseById);
router.route('/:courseId').put(courseControllers.updatedCourse);
router.route('/:courseId').delete(courseControllers.deleteCourse);

export default router;
