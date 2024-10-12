/** @format */
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

// MongoDB connection URL
const url = 'mongodb+srv://abdullahyoussif64:nodejs_123@cluster0.h9wgh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(url);
export const connectMongoClient = async () => {
	await client.connect();
	console.log('MongoClient connected');

	const collection = client.db('courses');
	const courses = collection.collection('posts');

	// Insert a new course (optional)

	// Fetch all courses
	const data = await courses.find({}).toArray();
	console.log('data =========',data);
	return data;
};

// Function to connect using Mongoose (for Mongoose models)
export const connectMongoose = async () => {
    try {
        await mongoose.connect(url, {
            // Removed deprecated options
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Mongoose connected');
    } catch (error) {
        console.error('Error connecting to MongoDB with Mongoose:', error);
    }
};