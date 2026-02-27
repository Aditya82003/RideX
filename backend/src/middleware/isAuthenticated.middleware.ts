import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "./asyncHandler.middleware";
import { UnauthorizedException } from "../utilities/appError";
import { verifyToken } from "../utilities/jwt";
import { prisma } from "../lib/prisma";

export const isAuthenticatedUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies

    if (!token) {
        throw new UnauthorizedException('Unauthorized')
    }

    const decoded = verifyToken(token)
    const user = await prisma.user.findUnique({
        where: {
            id: decoded.id
        }
    })

    if (!user) {
        throw new UnauthorizedException('Unauthorized')
    }

    req.userId = user.id

    next()
})

export const isAuthenticatedCaptain = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies

    if (!token) {
        throw new UnauthorizedException('Unauthorized')
    }

    const decoded = verifyToken(token)
    const captain = await prisma.captain.findUnique({
        where: {
            id: decoded.id
        }
    })
    if(!captain){
        throw new UnauthorizedException('Unauthorized')
    }
    req.captainId = captain.id
    next()
})