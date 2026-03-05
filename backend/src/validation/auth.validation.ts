import * as z from 'zod'
import { VehicleType } from '../generated/prisma/enums'

export const Email = z.string().regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
export const Firstname = z.string().min(3)
export const Lastname = z.string().min(3)
export const Password = z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
export const Phone = z.string().regex(/^[6-9]\d{9}$/)

export const VehicleColour = z.string().min(3)
export const VehiclePLate = z.string().regex(/^[A-Z]{2}\s\d{2}\s[A-Z]{1,3}\s\d{4}$/).nonempty()
export const VehicleCapacity = z.number().min(2)
export const VehicleTypes = z.enum([
    VehicleType.car,
    VehicleType.motorcycle,
    VehicleType.auto
])

export const userRegisterSchema = z.object({
    email : Email,
    firstname : Firstname,
    lastname : Lastname.optional(),
    password : Password
})

export const userLoginSchema = z.object({
    email :Email,
    password : Password,
})

export const captainRegisterSchema = z.object({
    email : Email,
    firstname : Firstname,
    lastname : Lastname.optional(),
    password : Password,
    vehicleColour : VehicleColour,
    vehiclePlate : VehiclePLate,
    vehicleCapacity : VehicleCapacity,
    vehicleType : VehicleTypes
})

export const captainSignInSchema = z.object({
    email : Email,
    password : Password
})