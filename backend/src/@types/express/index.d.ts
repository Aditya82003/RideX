import { Captain, User } from "../../generated/prisma/client"

declare global {
  namespace Express {
    interface Request {
      userId?: string
      captainId?: string
      user? : User
      captain?:Captain
    }
  }
}