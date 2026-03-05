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
        await redis.decr(`driver:cell:${oldCell}`)
    }
    //Increment new cell
    if(!oldCell || oldCell !== newCell){
        await redis.incr(`driver:cell:${newCell}`)
        await redis.set(`driver:${driverId}:cell`,newCell)
    }
    await redis.geoadd('drivers:geo',lng,lat,driverId)
}