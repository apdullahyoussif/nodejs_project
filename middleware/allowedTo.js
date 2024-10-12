import appError from "../utils/appError.js"; 

export default (...roles) => {
    console.log("roles", roles);
    
    return (req, res, next) => {
        if (req.user.role === 'ADMIN' || req.user.role === 'MANGER') {
            next();
        } else {
            const error = appError.create('Unauthorized access', 401, httpStatus.UNAUTHORIZED);
            return next(error);
        }
    }
}