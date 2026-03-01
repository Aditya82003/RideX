import express from 'express'
import { createRideController } from '../controllers/ride.controller'
import { isAuthenticatedUser } from '../middleware/isAuthenticated.middleware'

const router = express.Router()

router.post('/create',isAuthenticatedUser,createRideController)

export default router