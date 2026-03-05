import {latLngToCell,gridDisk} from 'h3-js'

const RESOLUTION = 8

export const getCellId = (lat:number,lng:number)=>{
    return latLngToCell(lat,lng,RESOLUTION)
}

export const getNeighborCells = (cellId:string)=>{
    return gridDisk(cellId,1)
}