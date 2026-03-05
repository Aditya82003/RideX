
import { VehicleType } from "../generated/prisma/enums"
import { getCellId } from "../lib/h3"
import { prisma } from "../lib/prisma"
import { redis } from "../lib/redis"
import { generateOTP } from "../utilities/otp"
import { getDistanceTime } from "./map.service"
import { getFarePriceService } from "./price.service"

export const createRideService = async (
    userId: string,
    body: {
        pickup:string,
        destination:string,
        originLongitude: number,
        originLatitude: number,
        destinationLongitude: number,
        destinationLatitude: number,
        vehicleType: VehicleType
    }) => {

    // const { pickup, destination, originLongitude, originLatitude, destinationLongitude, destinationLatitude, vehicleType } = body

    // const {fare,approxDistance,approxDuration} = await getFarePriceService(originLongitude, originLatitude, destinationLongitude, destinationLatitude, vehicleType)

    // const otp = generateOTP()

    // const ride = await prisma.ride.create({
    //     data:{
    //         userId,
    //         pickup,
    //         destination,
    //         pickuplat:originLatitude,
    //         pickuplng:originLongitude,
    //         destlat:destinationLatitude,
    //         destlng:destinationLongitude,
    //         fare,
    //         duration:approxDuration,
    //         distance:approxDistance,
    //         otp
    //     }
    // })
    // return ride
}

export const incrementRideDemand = async(
    rideId:string,
    lat:number,
    lng:number
)=>{
    const cellId =  getCellId(lat,lng)

    await redis.incr(`ride:cell:${cellId}`)
    await redis.set(`ride:${rideId}:cell`,cellId)
}

export const decrementRideDemand = async(rideId:string)=>{
    const cellId = await redis.get(`ride:${rideId}:cell`)
    if(!cellId) return

    await redis.decr(`rides:cell:${cellId}`)
    await redis.del(`ride:${rideId}:cell`)
}