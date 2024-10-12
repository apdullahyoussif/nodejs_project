/** @format */
// controllers/user.controller.js
/** @format */
import asyncWrapper from '../middleware/asyncWraper.js';
import User from '../models/user.model.js';
import appError from '../utils/appError.js';
import httpStatus from '../utils/httpStatus.js';
import bcrypt from 'bcryptjs';
import generateJWT from '../utils/generateJWT.js';
// GET all users
const getAllUsers = asyncWrapper(async (req, res) => {
	const query = req.query;

	const limit = query.limit || 2;
	const page = query.page || 1; // Page defaults to 1
	const skip = (page - 1) * limit;

	const users = await User.find({}, { __v: false }).limit(limit).skip(skip);
	res.json({ status: httpStatus.SUCCESS, data: { users } });
});

// POST register a new user
const register = asyncWrapper(async (req, res, next) => {
	console.log(req.body);

	const { firstName, lastName, email, password , role} = req.body;

	// Check if user already exists
	const userExists = await User.findOne({ email });
	if (userExists) {
		const error = appError.create('User already exists', 400, httpStatus.FAIL);
		return next(error);
	}

	// Hash the password
	const hashedPassword = await bcrypt.hash(password, 10); // Await here to get the actual hashed password

	// Create a new user
	const newUser = new User({
		firstName,
		lastName,
		email,
		password: hashedPassword, // Store the hashed password
        role,
	});

	// Generate a token
	const token = await generateJWT({ email: newUser.email, _id: newUser._id ,role: newUser.role});
	newUser.token = token;

	// Save the new user
	await newUser.save();

	res
		.status(201)
		.json({ status: httpStatus.SUCCESS, data: { newUser, token } });
});
// POST user login
const login = asyncWrapper(async (req, res, next) => {
	const { email, password } = req.body;

	// Find user by email
	if (!email || !password) {
		const error = appError.create('Invalid credentials', 400, httpStatus.FAIL);
		return next(error);
	}
	const user = await User.findOne({ email });
	if (!user) {
		const error = appError.create('Invalid credentials', 400, httpStatus.FAIL);
		return next(error);
	}
	const matchedPassword = await bcrypt.compare(password, user.password);
	if (!matchedPassword) {
		const error = appError.create('Invalid credentials', 400, httpStatus.FAIL);
		return next(error);
	}
	const token = await generateJWT({ email: user.email, _id: user._id ,role: user.role});

	res.json({
		status: httpStatus.SUCCESS,
		message: 'Login successful',
		data: { token },
	});
});

export default {
	getAllUsers,
	register,
	login,
};
