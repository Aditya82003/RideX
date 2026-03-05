import { NotFoundException } from "../utilities/appError"
import { getDistanceTime } from "./map.service"
import { calculateFare } from "./fare.service"

export const getFarePriceService = async (
    body: {
        pickupLocation: string,
        destination: string,
        pickupLongitude: number,
        pickupLatitude: number,
        destinationLongitude: number,
        destinationLatitude: number,
    }
) => {
    const {pickupLongitude, pickupLatitude, destinationLongitude, destinationLatitude} = body
    const { distance, duration } = await getDistanceTime(pickupLongitude, pickupLatitude, destinationLongitude, destinationLatitude)
    if (!distance || !duration) {
        throw new NotFoundException("Origin or destination not found")
    }

    const {fares} = await calculateFare(pickupLatitude,pickupLongitude,distance,duration)
    
    return {
        fares,
        distance,
        duration
    }
}