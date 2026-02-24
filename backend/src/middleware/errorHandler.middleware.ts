import { NextFunction, Request, Response } from "express";
import { HTTPSTATUS } from "../config/https.config";
import { AppError } from "../utilities/appError";

export const errorHandler = (error : any, req:Request,res:Response,next:NextFunction)=>{
    console.log(`Error occured on path ${req.path}`,error)

    if(error instanceof SyntaxError){
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
            message : 'Invlaid JSON'
        } )
    }
    if(error instanceof AppError){
        return res.status(error.statusCode).json({
            message : error.message
        })
    }

    res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message : error.message || 'Internal server error'
    })
}