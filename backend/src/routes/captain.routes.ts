import express from 'express'
import { changeCaptainPasswordController, getCurrentCaptainController, updateCaptainProfileController } from '../controllers/captain.controller'

const router = express.Router()

router.get('/',getCurrentCaptainController)
router.post('/update',updateCaptainProfileController)
router.post('/changepassword',changeCaptainPasswordController)

export default router