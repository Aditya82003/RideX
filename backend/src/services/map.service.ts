import axios from 'axios'
import { config } from '../config/app.config'
import { InternalServerException, NotFoundException } from '../utilities/appError'

export const getAddressCoordinate = async(address:string)=>{
    try{
        const response = await axios.get("https://api.locationiq.com/v1/search",{
            params:{
                key:config.GOOGLE_MAP_API,
                q:address,
                format:"json",
                limit:1,
                countrycodes:"in"
            }
        })
        if(!response.data.length){
            throw new NotFoundException("Address not found")
        }
        const location = response.data[0]

        return {
            latitude:location.lat,
            longitude:location.lon,
            displayName:location.display_name
        }
    }catch(error){
        throw new NotFoundException("Address not found")
    }
}

export const getDistanceTime = async(
    origin:string,
    destination:string
)=>{
    if(!origin || !destination){
        throw new NotFoundException("Origin or destination not found")
    }
    const {latitude:originLatitude,longitude:originLongitude}=await getAddressCoordinate(origin)
    const {latitude:destinationLatitude,longitude:destinationLongitude}=await getAddressCoordinate(destination)
    try{
        const coordinate = `${originLongitude},${originLatitude};${destinationLongitude},${destinationLatitude}`
        const url = `https://api.locationiq.com/v1/directions/driving/${coordinate}`
        const response = await axios.get(url,
            {
                params:{
                    key:config.GOOGLE_MAP_API,
                    geometries:"polyline",
                    overview:"full",
                    steps:false
                }
            }
        )
        const route=response.data.routes[0]
        return {
            distance:route.distance/1000,
            duration:Math.ceil(route.duration/60)
        }
    }catch(error){
        throw new InternalServerException("Internet server error")
    }
}

export const getAutoCompleteAddress = async(address:string)=>{
    try{
        const response = await axios.get("https://api.locationiq.com/v1/autocomplete",{
            params:{
                key:config.GOOGLE_MAP_API,
                q:address,
                format:"json",
                limit:10,
                countrycodes:"in"
            }
        })

        return response.data
    }catch(error:any){
        throw new InternalServerException(error.response?.data)
    }
}
