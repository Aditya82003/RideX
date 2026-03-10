import { redis } from "../lib/redis"
import { getNeighborCells } from "../lib/h3"

const MAX_SURGE = 3

const computedSurge = (rides: number, drivers: number) => {
    if (drivers === 0) return MAX_SURGE

    const ratio = rides / drivers

    if (ratio <= 1) return 1
    if (ratio <= 1.5) return 1.3
    if (ratio <= 2) return 1.6;
    if (ratio <= 3) return 2.2;

    return MAX_SURGE
}

export const getCellSurge = async(cellId:string)=>{

    const cached = await redis.get(`surge:cell:${cellId}`)
    if(cached) return parseFloat(cached)
    
    const neighborCells = getNeighborCells(cellId)

    let totalDrivers = 0
    let totalRides = 0

    for (const cell of neighborCells){
        const drivers = await redis.scard(`driver:cell:${cell}`)
        const rides = await redis.get(`ride:cell:${cell}`)

        totalDrivers += drivers 
        totalRides += rides ? parseInt(rides) : 0
    }

    const surge = computedSurge(totalRides,totalDrivers)
    //here we add surge of that cell in redis which expire in 30sec
    await redis.set(`surge:cell:${cellId}`,
        surge,
        'EX',
        30
    )
    return surge
}