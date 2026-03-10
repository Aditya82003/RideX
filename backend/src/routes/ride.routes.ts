import express from 'express'
import { confirmRideController, createRideController, getEstimateFareController, startRideController } from '../controllers/ride.controller'
import { isAuthenticatedCaptain, isAuthenticatedUser } from '../middleware/isAuthenticated.middleware'

const router = express.Router()

router.post('/create',isAuthenticatedUser,createRideController)
//to get fare of all vehicle
router.post('/fare',isAuthenticatedUser,getEstimateFareController)

router.post('/:rideId/confirm',isAuthenticatedCaptain,confirmRideController)

router.post('/:rideId/start-ride',startRideController)
export default router