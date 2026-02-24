import jwt, { JwtPayload } from 'jsonwebtoken'
import { config } from '../config/app.config'
import { UnauthorizedException } from './appError'

type TokenPayload = {
    id : string
}
export const generateToken = (payload:TokenPayload):string =>{
    return jwt.sign(payload,config.JWT_SECRET,{
        expiresIn:'7d'
    })
}

export const verifyToken = (token:string):TokenPayload =>{
    try{
        return jwt.verify(token,config.JWT_SECRET) as TokenPayload
    }catch(error){
        throw new UnauthorizedException('Invalid token or expired token') //---------------
    }
}
