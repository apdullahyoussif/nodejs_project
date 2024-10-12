/** @format */

// modles/user.model.js
import mongoose from 'mongoose';

import validator from 'validator';
import userRole from '../utils/userRoles.js';

// Define the course schema
const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		validate: [validator.isEmail, 'Please provide a valid email'],
	},
	password: {
		type: String,
		required: true,
	},
	token: {
		type: String,
	},
	role: {
		type: String,
		enum: [userRole.ADMIN, userRole.USER, userRole.MANGER],
		default: userRole.USER,
	},
	avatar: {
		type: String,
		default: 'uploads/profile.webp'
	},
});

// Export the Course model (use singular naming)
const User = mongoose.model('User', userSchema);

export default User;
