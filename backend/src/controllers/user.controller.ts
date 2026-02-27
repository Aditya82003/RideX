import { Request, Response } from "express"
import { asyncHandler } from "../middleware/asyncHandler.middleware"
import { BadRequestException, UnauthorizedException } from "../utilities/appError"
import { HTTPSTATUS } from "../config/https.config"
import { changePasswordService, fetchCurrentUser, updateUserProfileService } from "../services/user.services"
import {  ChangePasswordSchema, userUpdateSchema } from "../validation/user.validation"

export const userUpdateProfileController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId
    if (!userId) {
        throw new UnauthorizedException('Unauthorized.Please login')
    }
    const body = userUpdateSchema.safeParse(req.body)

    if (!body.success) {
        throw new BadRequestException(body.error.message)
    }

    const {updatedUser} = await updateUserProfileService(userId, body.data)

    return res.status(HTTPSTATUS.OK).json({
        message:"User updated successfully",
        updatedUser
    })
})

export const getCurrentUserController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId

    if (!userId) {
        throw new UnauthorizedException('Unauthorized.Please login')
    }
    const { user } = await fetchCurrentUser(userId)

    res.status(HTTPSTATUS.OK).json({
        message: "User fetched successfully",
        user
    })
})

export const userChangePasswordController = asyncHandler(async(req:Request,res:Response)=>{
    const userId = req.userId
    if(!userId){
        throw new UnauthorizedException('Unauthorized.Please login')
    }
    const body = ChangePasswordSchema.safeParse(req.body)

    if(!body.success){
        throw new BadRequestException(body.error.message)
    }
    await changePasswordService(userId,body.data)

    res.clearCookie("token")

    res.status(HTTPSTATUS.OK).json({
        message:"Password changed successfully"
    })
})

