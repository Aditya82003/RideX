import dotenv from 'dotenv'
dotenv.config()

import express, { Request, Response } from 'express'
import { config } from './config/app.config'
import { asyncHandler } from './middleware/asyncHandler.middleware'
import { BadRequestException } from './utilities/appError'

const app = express()

const PORT = config.PORT || 5000

app.get('/',asyncHandler(async(req:Request,res:Response)=>{
    throw new BadRequestException('Bad request')
}))

app.listen(PORT,()=>console.log(`Server running at PORT ${PORT}`))