import { Router } from 'express'
import { createProgram, updateProgramStatus, getPrograms } from './program.controller.js'
import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware.js'
import { Role } from '../user/schema/user.js'

const router = Router()

// Create program (only DEPARTMENT_HEAD or SUPER_ADMIN)
router.post(
  '/',
  authenticate,
  authorizeRoles(Role.DEPARTMENT_HEAD, Role.SUPER_ADMIN),
  createProgram,
)

// Update program status (only officer or admin)
router.patch(
  '/:id/status',
  authenticate,
  authorizeRoles(Role.OFFICER, Role.SUPER_ADMIN, Role.DEPARTMENT_HEAD),
  updateProgramStatus,
)

// Get all programs (any authenticated user)
router.get('/', authenticate, getPrograms)

export default router
