import express from 'express'
import { changeCaptainPasswordController, getCurrentCaptainController, updateAvailabilityController, updateCaptainProfileController } from '../controllers/captain.controller'

const router = express.Router()

router.get('/',getCurrentCaptainController)
router.post('/update',updateCaptainProfileController)
router.post('/changepassword',changeCaptainPasswordController)

//captain(driver) routes
router.put('/:captainId/availability',updateAvailabilityController)


export default router