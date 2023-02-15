import express from 'express'
const router = express.Router()

import {
  getUserProfile,
  loginUser,
  registerUser,
} from '../controllers/userController.js'

import protect from '../middleware/authMiddleware.js'

router.route('/').post(registerUser)
router.route('/login').post(loginUser)
router.route('/profile').get(protect, getUserProfile)

export default router
