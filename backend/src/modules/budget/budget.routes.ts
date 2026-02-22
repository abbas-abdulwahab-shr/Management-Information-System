import { Router } from 'express'
import {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} from './budget.controller.js'
import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware.js'
import { Role } from '../user/schema/user.js'

const router = Router()

// Create budget (DEPARTMENT_HEAD or SUPER_ADMIN)
router.post(
  '/',
  authenticate,
  authorizeRoles(Role.DEPARTMENT_HEAD, Role.SUPER_ADMIN),
  createBudget,
)

// Get all budgets (any authenticated user)
router.get('/', authenticate, getBudgets)

// Update budget (DEPARTMENT_HEAD or SUPER_ADMIN)
router.patch(
  '/:id',
  authenticate,
  authorizeRoles(Role.DEPARTMENT_HEAD, Role.SUPER_ADMIN),
  updateBudget,
)

// Delete budget (SUPER_ADMIN only)
router.delete('/:id', authenticate, authorizeRoles(Role.SUPER_ADMIN), deleteBudget)

export default router
