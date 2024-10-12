import jwt from 'jsonwebtoken';
import appError from '../utils/appError.js'; // Assuming you have a custom error utility

const verfiyToken = (req, res, next) => {
	const authHeader = req.headers['authorization'] || req.headers['Authorization'];
	
    // Check if the authHeader exists
	if (!authHeader) {
		return res.status(401).json({
			status: 'error',
			message: 'Token not found',
		});
	}

	// Extract token from the Bearer schema
	const token = authHeader.split(' ')[1];

	try {
		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
   

		// Attach decoded information to request object
		req.user = decoded;
		
		// Proceed to the next middleware/controller
		next();
	} catch (err) {
		// Handle invalid token
		const error = appError.create('Invalid token', 401, 'error');
		return next(error);
	}
};

export default verfiyToken;
