import * as z from 'zod'

export const Email = z.string().regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
export const Firstname = z.string().min(3)
export const Lastname = z.string().min(3)
export const Password = z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)

export const userRegisterSchema = z.object({
    email : Email,
    firstname : Firstname,
    lastname : Lastname,
    password : Password
})

export const userLoginSchema = z.object({
    email :Email,
    password : Password,
})