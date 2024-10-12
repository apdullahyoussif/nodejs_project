import express from 'express';
import mongoose from 'mongoose';
import coursesRouter from './routes/courses.route.js';
import usersRouter from './routes/users.route.js';
import httpStatus from './utils/httpStatus.js';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url'; // Import this to handle __dirname in ES modules
import cors from 'cors';

const url = process.env.MONGOOSE_DATABASE;

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect(url).then(() => {
	console.log('Mongoose successfully connected');
});

const app = express();
app.use(cors());
app.use(express.json());

// Use the fixed __dirname
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/courses', coursesRouter);
app.use('/api/users', usersRouter);

// global middleware for not found
app.all('*', (req, res) => {
	return res
		.status(404)
		.json({ status: httpStatus.ERROR, message: 'Route not found' });
});

// global middleware for error handling
app.use((err, req, res, next) => {
	res.status(500).json({ status: httpStatus.ERROR, message: err.message });
});

const PORT = 4000;
app.listen(PORT, () => {
	console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
