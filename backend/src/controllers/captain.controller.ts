import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { BadRequestException, UnauthorizedException } from "../utilities/appError";
import { fetchCurrentCaptain, updateCaptainPasswordService, updateCaptainProfileService } from "../services/captain.service";
import { HTTPSTATUS } from "../config/https.config";
import { updateCaptainSchema } from "../validation/captain.validation";
import { ChangePasswordSchema } from "../validation/user.validation";

export const getCurrentCaptainController = asyncHandler(async (req: Request, res: Response) => {
    const captainId = req.captainId

    if (!captainId) {
        throw new UnauthorizedException('Unauthorized')
    }

    const { captain } = await fetchCurrentCaptain(captainId)

    res.status(HTTPSTATUS.OK).json({
        message: "Captain fetched successfully",
        captain
    })
})

export const updateCaptainProfileController = asyncHandler(async (req: Request, res: Response) => {
    const captainId = req.captainId
    if(!captainId){
        throw new UnauthorizedException("Unauthorized")
    }
    const body = updateCaptainSchema.safeParse(req.body)

    if(!body.success){
        throw new BadRequestException(body.error.message)
    }

    const {updatedCaptain} = await updateCaptainProfileService(captainId,body.data)

    res.status(HTTPSTATUS.OK).json({
        message:"Captain updated successfully",
        updatedCaptain
    })
})

export const changeCaptainPasswordController = asyncHandler(async (req: Request, res: Response) => {
    const captainId = req.captainId
    if(!captainId){
        throw new UnauthorizedException("Unauthorized")
    }
    const body = ChangePasswordSchema.safeParse(req.body)

    if(!body.success){
        throw new BadRequestException(body.error.message)
    }
    await updateCaptainPasswordService(captainId,body.data)

    res.status(HTTPSTATUS.OK).json({
        message:"Password changed successfully"
    })
})