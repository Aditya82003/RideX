import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { loginUserService, registerCaptainService, registerUserService, signInCaptainService } from "../services/auth.services";
import { captainRegisterSchema, captainSignInSchema, userLoginSchema, userRegisterSchema } from "../validation/auth.validation";
import { HTTPSTATUS } from "../config/https.config";
import { BadRequestException, UnauthorizedException } from "../utilities/appError";
import { config } from "../config/app.config";

export const userRegisterController = asyncHandler(async (req: Request, res: Response) => {
    const body = userRegisterSchema.safeParse(req.body)

    if (!body.success) {
        throw new BadRequestException(body.error.message)
    }
    await registerUserService(body.data)

    return res.status(HTTPSTATUS.CREATED).json({
        message: "User created successfully.Please login."
    })
})

export const userSignInController = asyncHandler(async (req: Request, res: Response) => {
    const body = userLoginSchema.safeParse(req.body)

    if (!body.success) {
        throw new BadRequestException(body.error.message)
    }

    const { token, user } = await loginUserService(body.data)

    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: config.MODE_ENV === 'PRODUCTION',
    })
    res.status(HTTPSTATUS.OK).json({
        message: "User logged in successfully",
        user
    })
})

export const userLogoutController = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
    });
    res.status(HTTPSTATUS.OK).json({
        message: "User logged out successfully"
    })
})

export const captainRegisterController = asyncHandler(async (req: Request, res: Response) => {
    const body = captainRegisterSchema.safeParse(req.body)

    if (!body.success) {
        throw new BadRequestException(body.error.message)
    }
    await registerCaptainService(body.data)

    res.status(HTTPSTATUS.CREATED).json({
        message: "Captain created successfully.Please Login in Captain Portal"
    })
})

export const captainSigninController = asyncHandler(async (req: Request, res: Response) => {
    const body = captainSignInSchema.safeParse(req.body)

    if (!body.success) {
        throw new BadRequestException(body.error.message)
    }

    const { token, captain } = await signInCaptainService(body.data)

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
    })
    res.status(HTTPSTATUS.OK).json({
        message: "Captain logged in successfully",
        captain
    })
})

export const captainLogoutController = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
    });
    res.status(HTTPSTATUS.OK).json({
        message: "Captain logged out successfully"
    })
})