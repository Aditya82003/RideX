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
import { isAuthenticatedCaptain, isAuthenticatedUser } from './middleware/isAuthenticated.middleware'
import cookieParser from 'cookie-parser'
import {getDistanceTime} from './services/map.service'


const app = express()

const PORT = config.PORT || 5000
const BASE_PATH = config.BASE_PATH

app.use(cors({
    origin : config.FRONTEND_ORIGIN,
    credentials : true
}))
// console.log(await getDistanceTime("Delhi","Jhansi"))

app.use(express.json())
app.use(cookieParser())


app.get('/',asyncHandler(async(req:Request,res:Response)=>{
    throw new BadRequestException('Bad request')
}))

app.use(`${BASE_PATH}/auth`,authRoutes)
app.use(`${BASE_PATH}/user`,isAuthenticatedUser,userRoutes)
app.use(`${BASE_PATH}/captain`,isAuthenticatedCaptain,captainRoutes)

app.use(errorHandler)

app.listen(PORT,()=>console.log(`Server running at PORT ${PORT}`))