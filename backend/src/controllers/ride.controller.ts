import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { createRideSchema, EstimateFareSchema } from "../validation/ride.validation";
import { BadRequestException, UnauthorizedException } from "../utilities/appError";
import { getFarePriceService } from "../services/price.service";
import { HTTPSTATUS } from "../config/https.config";
import { confirmRideService, createRideService, incrementRideDemand, startRideService } from "../services/ride.service";
import { getCellId, getNeighborCells } from "../lib/h3";
import { redis } from "../lib/redis";

export const createRideController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId
    if (!userId) {
        throw new UnauthorizedException("Unauthorized")
    }
    const body = createRideSchema.safeParse(req.body)
    if (!body.success) {
        throw new BadRequestException(body.error.message)
    }

    const ride = await createRideService(userId, body.data)
    if (!ride) {
        throw new BadRequestException("Ride not created")
    }
    res.status(HTTPSTATUS.CREATED).json(ride)

    const { pickuplat, pickuplng } = ride

    await incrementRideDemand(ride?.id, pickuplat, pickuplng)

    const cellId = getCellId(pickuplat, pickuplng)
    const neighborsCell = getNeighborCells(cellId)

    let drivers: string[] = []

    for (const cell of neighborsCell) {
        const driver = await redis.zrange(`driver:cell:${cell}`, 0, -1)
        drivers.push(...driver)
    }

    drivers.map((driver) => {
        console.log(driver)  // socket to send rides details to all driver
    })

    // Add socket logic to notify all rider 
})

export const getEstimateFareController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId
    if (!userId) {
        throw new UnauthorizedException("Unauthorized")
    }
    const body = EstimateFareSchema.safeParse(req.body)
    if (!body.success) {
        throw new BadRequestException(body.error.message)
    }

    const { fares, distance, duration } = await getFarePriceService(body.data)

    return res.status(HTTPSTATUS.OK).json({
        message: "Fare fetched successfully",
        fares,
        distance,
        duration
    })
})

export const confirmRideController = asyncHandler(async (req: Request, res: Response) => {
    const  rideId  = req.params.rideId as string
    const captainId = req.captainId
    if (!captainId || !rideId) {
        throw new UnauthorizedException("Unauthorized")
    }
    const ride = await confirmRideService({ rideId, captainId })
    //send notification to user by socket

    return res.status(HTTPSTATUS.OK).json(ride)
})

export const startRideController =asyncHandler(async(req:Request,res:Response)=>{
    const rideId = req.params.rideId as string
    const otp = req.body

    if(!rideId || !otp){
        throw new BadRequestException("RideId and otp is required")
    }
    const ride = await startRideService({rideId,otp})
    //socket notification
    res.status(HTTPSTATUS.OK).json(ride)
})