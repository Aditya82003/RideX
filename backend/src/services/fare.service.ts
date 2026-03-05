import { getCellId } from "../lib/h3"
import { getCellSurge } from "./surge.service"

const fareConfigs = {
  CAR: {
    baseFare: 50,
    perKmRate: 12,
    perMinuteRate: 2,
    minimumFare: 80,
  },
  BIKE: {
    baseFare: 20,
    perKmRate: 6,
    perMinuteRate: 1,
    minimumFare: 40,
  },
  AUTO: {
    baseFare: 30,
    perKmRate: 8,
    perMinuteRate: 1.5,
    minimumFare: 60,
  },
};

export const calculateFare = async(
    lat:number,
    lng:number,
    distanceKm:number,
    durationMin:number,
)=>{
    const cellId = getCellId(lat,lng)

    const surge = await getCellSurge(cellId)

    const result =[]

    for(const [vehicleType,config] of Object.entries(fareConfigs)){
        const baseFare = config.baseFare + (distanceKm * config.perKmRate) + (durationMin * config.perMinuteRate)
        const finalFare = Math.max(baseFare,config.minimumFare) * surge
        result.push({
            vehicleType,
            fare: Math.round(finalFare),
            surgeMultiplier: surge
        })
    }
    return {
        fares:result ,
    }

}