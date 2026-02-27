import { prisma } from "../lib/prisma"
import { BadRequestException, NotFoundException } from "../utilities/appError"
import { comparedPassword, hashPassword } from "../utilities/hashPassword"

export const fetchCurrentUser = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
            phone: true,
            createdAt: true,
            updatedAt: true
        }
    })
    if (!user) {
        throw new NotFoundException('User not found')
    }
    return { user }
}

export const updateUserProfileService = async (
    userId: string,
    body: {
        firstname?: string,
        lastname?: string,
        phone?: string
    }) => {
    try {
        const { firstname, lastname, phone } = body

        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                ...(firstname !== undefined && {firstname}),
                ...(lastname !== undefined && {lastname}),
                ...(phone !== undefined && {phone})
            }, select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
                phone: true,
                createdAt: true,
                updatedAt: true
            }
        })
        return { updatedUser }
    } catch (error) {
        throw new NotFoundException('User not found')
    }
}

export const changePasswordService = async (
    userId: string,
    body: {
        oldPassword: string,
        newPassword: string
    }) => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    })
    if (!user) {
        throw new NotFoundException('User not found')
    }
    const isMatched = await comparedPassword(body.oldPassword, user.password)
    if (!isMatched) {
        throw new BadRequestException('Old password is incorrect')
    }
    const hashedPassword = await hashPassword(body.newPassword)

    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
    })
}