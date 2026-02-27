import express from 'express'
import { captainLogoutController, captainRegisterController, captainSigninController, userLogoutController, userRegisterController, userSignInController } from '../controllers/auth.controller'


const router = express.Router()

router.post('/user/register',userRegisterController)
router.post('user/signin',userSignInController)
router.get('/user/logout',userLogoutController)

router.post('/captain/register',captainRegisterController)
router.post('/captain/signin',captainSigninController)
router.get('/captain/logout',captainLogoutController)

export default router