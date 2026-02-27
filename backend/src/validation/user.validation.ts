import z from "zod";
import { Firstname, Lastname, Password, Phone } from "./auth.validation";

export const ChangePasswordSchema = z.object({
    oldPassword : Password,
    newPassword : Password
})

export const userUpdateSchema = z.object({
    firstname : Firstname.optional(),
    lastname : Lastname.optional(),
    phone : Phone.optional(),
})