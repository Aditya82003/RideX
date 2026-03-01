import z from "zod";
import { VehicleType } from "../generated/prisma/enums";

export const createRideSchema = z.object({
    pickup:z.string().nonempty(),
    destination:z.string().nonempty(),
    originLongitude : z.number().min(-180).max(180),
    originLatitude : z.number().min(-90).max(90),
    destinationLongitude : z.number().min(-180).max(180),
    destinationLatitude : z.number().min(-90).max(90),
    vehicleType: z.enum([
        VehicleType.car,
        VehicleType.motorcycle,
        VehicleType.auto
    ])
})