import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { loginUserService, registerUserService } from "../services/auth.services";
import { userLoginSchema, userRegisterSchema } from "../validation/auth.validation";
import { HTTPSTATUS } from "../config/https.config";
import { BadRequestException } from "../utilities/appError";
import { config } from "../config/app.config";

export const userRegisterController = asyncHandler(async(req:Request,res:Response)=>{
    const body = userRegisterSchema.safeParse(req.body)

    if(!body.success){
        throw new BadRequestException(body.error.message)
    }
    await registerUserService(body.data)

    return res.status(HTTPSTATUS.CREATED).json({
        message:"User created successfully.Please login."
    })
})

export const userSignInController = asyncHandler(async(req:Request,res:Response)=>{
    const body = userLoginSchema.safeParse(req.body)

    if(!body.success){
        throw new BadRequestException(body.error.message)
    }
    
    const{token,user} = await loginUserService(body.data)

    res.cookie('token',token,{
        httpOnly : true,
        maxAge:7*24*60*60*1000,
        secure : config.MODE_ENV === 'PRODUCTION',
    })
    res.status(HTTPSTATUS.OK).json({
        message:"User logged in successfully",
        user
    })
})

export const captainRegisterController = asyncHandler(async(req:Request,res:Response)=>{
    const body = req.body

    
})