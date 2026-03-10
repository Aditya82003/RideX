
import { VehicleType } from "../generated/prisma/enums"
import { getCellId } from "../lib/h3"
import { prisma } from "../lib/prisma"
import { redis } from "../lib/redis"
import { NotFoundException } from "../utilities/appError"
import { generateOTP } from "../utilities/otp"
import { getDistanceTime } from "./map.service"
import { getFarePriceService } from "./price.service"

export const createRideService = async (
    userId: string,
    body: {
        pickup: string,
        destination: string,
        originLongitude: number,
        originLatitude: number,
        destinationLongitude: number,
        destinationLatitude: number,
        vehicleType: VehicleType
    }) => {

    const { pickup, destination, originLongitude, originLatitude, destinationLongitude, destinationLatitude, vehicleType } = body

    const { fares, distance, duration } = await getFarePriceService({
        pickupLocation: pickup,
        destination,
        pickupLongitude: originLongitude,
        pickupLatitude: originLatitude,
        destinationLongitude,
        destinationLatitude
    })
    const fareObj = fares.find(f => f.vehicleType === vehicleType)
    if (!fareObj) {
        return
    }
    const ride = await prisma.ride.create({
        data: {
            userId,
            pickup,
            destination,
            pickuplng: originLongitude,
            pickuplat: originLatitude,
            destlng: destinationLongitude,
            destlat: destinationLatitude,
            fare: fareObj.fare,
            duration,
            distance,
            otp: generateOTP(),
        }
    })
    return ride
}

export const confirmRideService = async ({
    rideId,
    captainId
}: {
    rideId: string,
    captainId: string
}) => {
    if (!rideId || !captainId) {
        throw new NotFoundException("RideId or captainId not found")
    }
    await prisma.ride.updateMany({
        where: {
            id: rideId,
            status: "pending"
        },
        data: {
            status: "accepted",
            captainId
        }
    })
    const ride = await prisma.ride.findUnique({
        where: { id: rideId },
        select: {
            id: true,
            status: true,
            pickup: true,
            destination: true,
            otp: true,
            user: {
                select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                    phone: true

                }
            },
            captain: {
                select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                    phone: true,
                    vehiclePlate: true
                }
            }
        }
    })
    if (!ride) {
        throw new NotFoundException("Ride not found")
    }
    return ride
}

export const startRideService= async({rideId,otp}:{
    rideId:string,
    otp:string
})=>{
    const ride = await prisma.ride.findUnique({
        where:{id:rideId}
    })
    if(!ride){
        throw new NotFoundException("Ride not found")
    }
    if(ride.status !=="accepted"){
        throw new NotFoundException("Ride not accepted")
    }
    if(ride.otp !== otp){
        throw new NotFoundException("Invalid OTP")
    }
    await prisma.ride.update({
        where:{id:rideId},
        data:{
            status:"ongoing"
        }
    })
    return ride
}

export const incrementRideDemand = async (
    rideId: string,
    lat: number,
    lng: number
) => {
    const cellId = getCellId(lat, lng)

    await redis.incr(`ride:cell:${cellId}`)
    await redis.set(`ride:${rideId}:cell`, cellId)
}

export const decrementRideDemand = async (rideId: string) => {
    const cellId = await redis.get(`ride:${rideId}:cell`)
    if (!cellId) return

    await redis.decr(`rides:cell:${cellId}`)
    await redis.del(`ride:${rideId}:cell`)
}