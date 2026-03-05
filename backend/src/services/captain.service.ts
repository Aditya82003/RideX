import { CaptainStatus, VehicleType } from "../generated/prisma/enums"
import { prisma } from "../lib/prisma"
import { NotFoundException } from "../utilities/appError"
import { comparedPassword, hashPassword } from "../utilities/hashPassword"

export const fetchCurrentCaptain = async (captainId: string) => {
    const captain = await prisma.captain.findUnique({
        where: { id: captainId },
        select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
            phone: true,
            vehicleColour: true,
            vehiclePlate: true,
            vehicleCapacity: true,
            vehicleType: true,
            status: true,
            createdAt: true,
            updatedAt: true
        }
    })
    console.log(captain)
    if (!captain) {
        throw new NotFoundException("Captain not found")
    }
    return { captain }
}

export const updateCaptainProfileService = async (
    captainId: string,
    body: {
        firstname?: string,
        lastname?: string,
        phone?: string,
        vehicleColour?: string,
        vehiclePlate?: string,
        vehicleCapacity?: number,
        vehicleType?: VehicleType
    }
) => {
    try {
        const { firstname, lastname, phone, vehicleColour, vehiclePlate, vehicleCapacity, vehicleType } = body

        const updatedCaptain = await prisma.captain.update({
            where: { id: captainId },
            data: {
                ...(firstname !== undefined && { firstname }),
                ...(lastname !== undefined && { lastname }),
                ...(phone !== undefined && { phone }),
                ...(vehicleColour !== undefined && { vehicleColour }),
                ...(vehiclePlate !== undefined && { vehiclePlate }),
                ...(vehicleCapacity !== undefined && { vehicleCapacity }),
                ...(vehicleType !== undefined && { vehicleType })
            },
            select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
                phone: true,
                vehicleColour: true,
                vehiclePlate: true,
                vehicleCapacity: true,
                vehicleType: true,
                createdAt: true,
                updatedAt: true
            }
        })
        return { updatedCaptain }

    } catch (error) {
        throw new NotFoundException("Captain not found")
    }
}

export const updateCaptainPasswordService = async (
    captainId: string,
    body: {
        oldPassword: string,
        newPassword: string
    }
) => {
    const captain = await prisma.captain.findUnique({
        where: { id: captainId }
    })
    if (!captain) {
        throw new NotFoundException("Captain not found")
    }
    const isMAtched = await comparedPassword(body.oldPassword, captain.password)
    if (!isMAtched) {
        throw new NotFoundException("Current password is incorrect")
    }
    const hashedPassword = await hashPassword(body.newPassword)

    await prisma.captain.update({
        where: { id: captainId },
        data: { password: hashedPassword }
    })
}

export const updateAvailabilityService = async (
    captainId: string,
    body: {
        status: CaptainStatus,
        location?:{
            lng: number,
            lat: number
        }
    }
) => {
    const {status,location} = body  

    const captain = await prisma.captain.findUnique({
        where: {
            id: captainId
        }
    })
    if (!captain) {
        throw new NotFoundException("Captain not found")
    }

    const isAvailable = await prisma.captain.update({
        where: {
            id: captainId
        },
        data: {
            status,
            longitude:location?.lng,
            latitude:location?.lat
        },
        select: {
            status: true,
            longitude: true,
            latitude: true
        }
    })

    return  isAvailable 
}