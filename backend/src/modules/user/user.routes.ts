import { Router } from 'express'
import {
  register,
  login,
  getProfile,
  getAllUsers,
  updateProfile,
  deleteProfile,
} from './user.controller.js'
import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware.js'
import { Role } from './schema/user.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/users', authenticate, authorizeRoles(Role.SUPER_ADMIN), getAllUsers)
router.get('/profile', authenticate, (req, res) => getProfile(req, res))
router.put('/profile', authenticate, (req, res) => updateProfile(req, res))
router.delete(
  '/profile',
  authenticate,
  authorizeRoles(Role.SUPER_ADMIN, Role.DEPARTMENT_HEAD),
  (req, res) => deleteProfile(req, res),
)

export default router
