import { Router } from 'express'
import {
  createProgram,
  updateProgramStatus,
  getPrograms,
  getProgramDetail,
} from './program.controller.js'
// Get single program detail (any authenticated user)

import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware.js'
import { Role } from '../user/schema/user.js'

const router = Router()

// Create program (only DEPARTMENT_HEAD or SUPER_ADMIN)
router.post(
  '/create',
  authenticate,
  authorizeRoles(Role.DEPARTMENT_HEAD, Role.SUPER_ADMIN),
  createProgram,
)

// Update program status (only officer or admin)
router.patch(
  '/:id/status',
  authenticate,
  authorizeRoles(Role.OFFICER, Role.SUPER_ADMIN),
  updateProgramStatus,
)

// Get all programs (any authenticated user)
router.get('/', authenticate, getPrograms)

// Get program detail by ID (any authenticated user)
router.get('/:id', authenticate, getProgramDetail)

export default router
