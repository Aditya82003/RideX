import { NotFoundException } from "../utilities/appError"
import { getDistanceTime } from "./map.service"
import { price } from '../config/price.config'
import { VehicleType } from "../generated/prisma/enums"

export const getFarePriceService = async(
    originLongitude:number,
    originLatitude:number,
    destinationLongitude:number,
    destinationLatitude:number,
    vehicleType:VehicleType
)=>{
    const {distance:approxDistance,duration:approxDuration} = await getDistanceTime(originLongitude,originLatitude,destinationLongitude,destinationLatitude)
    if(!approxDistance || !approxDuration){
        throw new NotFoundException("Origin or destination not found")
    }
    const fare = {
        car: price.car.baseFare + (approxDistance * price.car.perKm) + (approxDuration * price.car.perMinute),
        auto: price.auto.baseFare + (approxDistance * price.auto.perKm) + (approxDuration * price.auto.perMinute),
        motorcycle: price.motorcycle.baseFare + (approxDistance * price.motorcycle.perKm) + (approxDuration * price.motorcycle.perMinute)
    }

    return {
        fare:Math.ceil(fare[vehicleType]),
        approxDistance,
        approxDuration
    }
}