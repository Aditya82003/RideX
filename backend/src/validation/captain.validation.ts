import z from "zod";
import { Firstname, Lastname, Phone, VehicleCapacity, VehicleColour, VehiclePLate, VehicleTypes } from "./auth.validation";
import { CaptainStatus } from "../generated/prisma/enums";

export const updateCaptainSchema = z.object({
    firstname:Firstname.optional(),
    lastname:Lastname.optional(),
    phone:Phone.optional(),
    vehicleColour:VehicleColour.optional(),
    vehiclePLate:VehiclePLate.optional(),
    vehicleCapacity:VehicleCapacity.optional(),
    vheicleType:VehicleTypes.optional()
})

export const updateAvailabilitySchema = z.object({
    status:z.enum([CaptainStatus.active,CaptainStatus.inactive]),
    location:z.object({
        lng:z.number().min(-180).max(180),
        lat:z.number().min(-90).max(90)
    }).optional()
})