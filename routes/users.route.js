/** @format */
import express from 'express';
import usersController from '../controllers/users.controller.js'; // Fix the import
import verfiyToken from '../middleware/verfiyToken.js';
import userRole from '../utils/userRoles.js';
import allowedTo from '../middleware/allowedTo.js';
import multer from 'multer';

const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads')
        },
        filename: function (req, file, cb) {
            const ext = file.mimetype.split('/')[1]
            const filename = `user-${Date.now()}.${ext}`
            cd(null, filename)
        }
    })

const fileFilter = (req, file, cb) => {
    const imaeType = file.mimetype.split('/')[0]
    if (imaeType === 'image') {
      return  cb(null, true)
    } else {
       return cb(null, false)
    }
}
const upload = multer({ storage, fileFilter })

  
const router = express.Router();

router.route('/').get(verfiyToken, usersController.getAllUsers); // Fix this method
router.route('/register').post(upload.single('avatar'),usersController.register); // Make sure register exists
router.route('/login').post(verfiyToken, allowedTo(userRole.ADMIN, userRole.MANGER),usersController.login); // Make sure login exists

export default router;
