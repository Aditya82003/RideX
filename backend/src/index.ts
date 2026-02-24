import 'dotenv/config'
// import dotenv from 'dotenv'
// dotenv.config()

import express, { Request, Response } from 'express'
import cors from 'cors'
import { config } from './config/app.config'
import { asyncHandler } from './middleware/asyncHandler.middleware'
import { BadRequestException } from './utilities/appError'
import { errorHandler } from './middleware/errorHandler.middleware'

import userRoutes from './routes/user.routes'

const app = express()

const PORT = config.PORT || 5000
const BASE_PATH = config.BASE_PATH

app.use(cors({
    origin : config.FRONTEND_ORIGIN,
    credentials : true
}))

app.use(express.json())


app.get('/',asyncHandler(async(req:Request,res:Response)=>{
    throw new BadRequestException('Bad request')
}))

app.use(`${BASE_PATH}/user`,userRoutes)

app.use(errorHandler)

app.listen(PORT,()=>console.log(`Server running at PORT ${PORT}`))