import { Router } from 'express'
import { syncProjects } from './erp.controller.js'
import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware.js'
import { Role } from '../user/schema/user.js'

const router = Router()

// Only SUPER_ADMIN can sync ERP projects
router.post(
  '/sync-projects',
  authenticate,
  authorizeRoles(Role.SUPER_ADMIN),
  syncProjects,
)

export default router
