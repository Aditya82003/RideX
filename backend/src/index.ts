import 'dotenv/config'

import express, { Request, Response } from 'express'
import cors from 'cors'
import { config } from './config/app.config'
import { asyncHandler } from './middleware/asyncHandler.middleware'
import { BadRequestException } from './utilities/appError'
import { errorHandler } from './middleware/errorHandler.middleware'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import captainRoutes from './routes/captain.routes'
import rideRoutes from './routes/ride.routes'
import { isAuthenticatedCaptain, isAuthenticatedUser } from './middleware/isAuthenticated.middleware'
import cookieParser from 'cookie-parser'
import { removeDriverLocation, updateDriverLocation } from './utilities/driverLocation'


const app = express()

const PORT = config.PORT || 5000
const BASE_PATH = config.BASE_PATH

app.use(cors({
    origin : config.FRONTEND_ORIGIN,
    credentials : true
}))

app.use(express.json())
app.use(cookieParser())

// await updateDriverLocation("ddf92b3e-a785-458b-b6ca-ca025bf54de4",26.8467,0.9462)
// await removeDriverLocation("ddf92b3e-a785-458b-b6ca-ca025bf54de4")

app.get('/',asyncHandler(async(req:Request,res:Response)=>{
    throw new BadRequestException('Bad request')
}))

app.use(`${BASE_PATH}/auth`,authRoutes)
app.use(`${BASE_PATH}/user`,isAuthenticatedUser,userRoutes)
app.use(`${BASE_PATH}/captain`,isAuthenticatedCaptain,captainRoutes)
app.use(`${BASE_PATH}/ride`,rideRoutes)

app.use(errorHandler)

app.listen(PORT,()=>console.log(`Server running at PORT ${PORT}`))