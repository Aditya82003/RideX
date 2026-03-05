import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { createRideSchema, EstimateFareSchema } from "../validation/ride.validation";
import { BadRequestException, UnauthorizedException } from "../utilities/appError";
import { getFarePriceService } from "../services/price.service";
import { HTTPSTATUS } from "../config/https.config";
import { createRideService } from "../services/ride.service";

export const createRideController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId
    if(!userId){
        throw new UnauthorizedException("Unauthorized")
    }
    const body = createRideSchema.safeParse(req.body)
    if(!body.success){
        throw new BadRequestException(body.error.message)
    }

    // Added limit logic for preventing user to outside city ride

    const ride = await createRideService(userId,body.data)

    res.status(HTTPSTATUS.OK).json({
        message:"Ride created successfully",
        ride
    })
    
    // Add socket logic to notify all rider 
})

export const getEstimateFareController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId
    if(!userId){
        throw new UnauthorizedException("Unauthorized")
    } 
    const body = EstimateFareSchema.safeParse(req.body)
    if(!body.success){
        throw new BadRequestException(body.error.message)
    }

    const {fares,distance,duration}= await getFarePriceService(body.data)

    return res.status(HTTPSTATUS.OK).json({
        message:"Fare fetched successfully",
        fares,
        distance,
        duration
    })
}) 