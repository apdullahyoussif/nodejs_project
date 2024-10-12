import mongoose from 'mongoose';

// Define the course schema
const courseSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
});

// Export the Course model (use singular naming)
const Course = mongoose.model('Course', courseSchema);

export default Course;
