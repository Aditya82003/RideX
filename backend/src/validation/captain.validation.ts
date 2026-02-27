import z from "zod";
import { Firstname, Lastname, Phone, VehicleCapacity, VehicleColour, VehiclePLate, VehicleTypes } from "./auth.validation";

export const updateCaptainSchema = z.object({
    firstname:Firstname.optional(),
    lastname:Lastname.optional(),
    phone:Phone.optional(),
    vehicleColour:VehicleColour.optional(),
    vehiclePLate:VehiclePLate.optional(),
    vehicleCapacity:VehicleCapacity.optional(),
    vheicleType:VehicleTypes
})