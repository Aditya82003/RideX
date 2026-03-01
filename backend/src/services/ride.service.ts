
import { VehicleType } from "../generated/prisma/enums"
import { prisma } from "../lib/prisma"
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

    const { pickup, destination, originLongitude, originLatitude, destinationLongitude, destinationLatitude, vehicleType } = body

    const {fare,approxDistance,approxDuration} = await getFarePriceService(originLongitude, originLatitude, destinationLongitude, destinationLatitude, vehicleType)

    const otp = generateOTP()

    const ride = await prisma.ride.create({
        data:{
            userId,
            pickup,
            destination,
            pickuplat:originLatitude,
            pickuplng:originLongitude,
            destlat:destinationLatitude,
            destlng:destinationLongitude,
            fare,
            duration:approxDuration,
            distance:approxDistance,
            otp
        }
    })
    return ride
}