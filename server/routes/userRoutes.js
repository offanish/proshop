import express from 'express'
const router = express.Router()

import {
  getUserProfile,
  getUsers,
  loginUser,
  registerUser,
  updateUserProfile,
} from '../controllers/userController.js'

import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').post(registerUser).get(protect, admin, getUsers)
router.route('/login').post(loginUser)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)

export default router
