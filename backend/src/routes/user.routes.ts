import express from 'express'
import { getCurrentUserController, userChangePasswordController, userUpdateProfileController } from '../controllers/user.controller'


const router = express.Router()

router.get('/', getCurrentUserController)
router.post('/update', userUpdateProfileController)
router.post('/changepassword',userChangePasswordController)

export default router