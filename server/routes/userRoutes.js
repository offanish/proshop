import express from 'express'
const router = express.Router()

import {
  deleteUser,
  getUserProfile,
  getUsers,
  loginUser,
  registerUser,
  updateUserProfile,
  getUserById,
  updateUser,
} from '../controllers/userController.js'

import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').post(registerUser).get(protect, admin, getUsers)
router.route('/login').post(loginUser)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)

router
  .route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser)
export default router
