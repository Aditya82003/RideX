import express from 'express'
import { createRideController, getEstimateFareController } from '../controllers/ride.controller'
import { isAuthenticatedUser } from '../middleware/isAuthenticated.middleware'

const router = express.Router()

router.post('/create',isAuthenticatedUser,createRideController)
//to get fare of all vehicle
router.post('/fare',isAuthenticatedUser,getEstimateFareController)

export default router