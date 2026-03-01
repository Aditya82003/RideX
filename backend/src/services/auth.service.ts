import { VehicleType } from '../generated/prisma/enums'
import { prisma } from '../lib/prisma'
import { BadRequestException, NotFoundException } from '../utilities/appError'
import { comparedPassword, hashPassword } from '../utilities/hashPassword'
import { generateToken } from '../utilities/jwt'

export const registerUserService = async (body: {
    email: string,
    firstname: string,
    lastname?: string,
    password: string,
}) => {
    const { email, firstname, lastname, password } = body

    const userExist = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (userExist) {
        throw new BadRequestException("User already exist")
    }

    const hashedPassword = await hashPassword(password)
    await prisma.user.create({
        data: {
            email,
            firstname,
            lastname,
            password: hashedPassword
        }
    })
}

export const loginUserService = async (body: {
    email: string,
    password: string,
}) => {

    const { email, password } = body

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!user) {
        throw new NotFoundException("User not found")
    }

    const isMatch = await comparedPassword(password, user.password)

    if (!isMatch) {
        throw new BadRequestException("Invalid credentials")
    }
    const token = generateToken({ id: user.id })

    return {
        token,
        user: {
            id: user.id,
        }
    }
}

export const registerCaptainService = async(body:{
    email:string,
    firstname:string,
    lastname?:string,
    password:string,
    vehicleColour:string,
    vehiclePlate:string,
    vehicleCapacity:number,
    vehicleType:VehicleType
})=>{
    const {email,firstname,lastname,password,vehicleColour,vehiclePlate,vehicleCapacity,vehicleType} = body

    const captainExist = await prisma.user.findUnique({
        where:{email}
    })

    if(captainExist){
        throw new BadRequestException("User already exist")
    }
    const hashedPassword = await hashPassword(password)

    await prisma.captain.create({
        data:{
            email,
            firstname,
            lastname,
            password:hashedPassword,
            vehicleColour,
            vehiclePlate,
            vehicleCapacity,
            vehicleType
        }
    })
}

export const signInCaptainService = async(body:{
    email:string,
    password:string
})=>{
    const {email,password} = body

    const captain = await prisma.captain.findUnique({
        where:{email}
    })

    if(!captain){
        throw new NotFoundException("Captain not found")
    }

    const isMatch = await comparedPassword(password,captain.password)

    if(!isMatch){
        throw new BadRequestException("Invalid credentials")
    }

    const token = generateToken({id:captain.id})

    return {
        token,
        captain:{
            id:captain.id
        }
    }
}