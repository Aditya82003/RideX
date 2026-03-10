import {redis} from '../lib/redis'
import {getCellId} from '../lib/h3'

export const updateDriverLocation = async(
    driverId:string,
    lat:number,
    lng:number
)=>{
    const newCell = getCellId(lat,lng)

    const oldCell = await redis.get(`driver:${driverId}:cell`)
    //If driver change cell
    if(oldCell && oldCell !== newCell){
        await redis.srem(`driver:cell:${oldCell}`,driverId)
    }
    //Increment new cell
    if(!oldCell || oldCell !== newCell){
        await redis.sadd(`driver:cell:${newCell}`,driverId)
        await redis.set(`driver:${driverId}:cell`,newCell)
    }
    await redis.geoadd('drivers:geo',lng,lat,driverId)
}

export const removeDriverLocation = async(driverId:string)=>{
    const cell = await redis.get(`driver:${driverId}:cell`) 
    if(!cell) return

    await redis.zrem('drivers:geo',driverId)
    await redis.del(`driver:${driverId}:cell`)

    await redis.srem(`driver:cell:${cell}`,driverId)
    const count = await redis.scard(`driver:cell:${cell}`)

    if(count <=0){
        await redis.del(`driver:cell:${cell}`)
    }
}