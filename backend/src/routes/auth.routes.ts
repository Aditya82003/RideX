import express from 'express'
import { captainRegisterController, userRegisterController } from '../controllers/auth.controller'


const router = express.Router()

router.post('/user/register',userRegisterController)
router.post('/captain/register',captainRegisterController)

export default router