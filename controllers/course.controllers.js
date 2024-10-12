/** @format */
import asyncWrapper from '../middleware/asyncWraper.js';
import Courses from '../models/course.model.js';
import Course from '../models/course.model.js'; // Use the correct import
import httpStatus from '../utils/httpStatus.js';
import appError from '../utils/appError.js';
// Get all courses
const getAllCourses = asyncWrapper(async (req, res) => {
	const query = req.query;

	const limit = query.limit || 2;
	const page = query.page || 2;
	const skip = (page - 1) * limit;
	const courses = await Courses.find({}, { "__v": false },{password: false})
		.limit(limit)
		.skip(skip);
	res.json({ status: httpStatus.SUCCESS, data: { courses } });
});

// Get a single course by ID
const getCourseById = asyncWrapper(async (req, res, next) => {
	const course = await Courses.findById(req.params.courseId);
	if (!course) {
		const error = appError.create(
			'Course not found',
			404,
			httpStatus.NOT_FOUND
		);
		return next(error);
	}

	res.json({ status: httpStatus.SUCCESS, data: { course } });
});

// Add a new course
const addCourse = asyncWrapper(async (req, res, next) => {
	const newCourses = new Courses(req.body);
	if (!newCourses) {
		const error = appError.create('Course not found', 404, httpStatus.NOT_FOUND);
		return next(error);
	}
	newCourses.save();
	res.json({ status: httpStatus.SUCCESS, data: { course: newCourses } });
});
// Edit a course
const updatedCourse = asyncWrapper(async (req, res, next) => {
	const courseId = req.params.courseId;

	// Find the course by ID and update it with the new data from req.body
	const updatedCourse = await Course.findByIdAndUpdate(
		courseId,
		{ $set: { ...req.body } },
		{ new: true } // Return the updated document
	);

	// If the course with the provided ID was not found, return a 404 error
	if (!updatedCourse) {
		const error = appError.create(
			'Course not found',
			404,
			httpStatus.NOT_FOUND
		);
		return next(error);
	}

	// Return the updated course
	return res.json({
		status: httpStatus.SUCCESS,
		data: { course: updatedCourse },
	});
});

// Delete a course
const deleteCourse =asyncWrapper( async (req, res) => {
	try {
		const deletedCourse = await Courses.findByIdAndDelete(req.params.courseId);
		if (!deletedCourse)
			return res
				.status(404)
				.json({ message: 'Course with the given ID not found' });
		res.json({ status: httpStatus.SUCCESS, data: null });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
})

export default {
	getAllCourses,
	getCourseById,
	addCourse,
	updatedCourse,
	deleteCourse,
};
