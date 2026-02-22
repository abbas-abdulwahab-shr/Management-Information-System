import { Router } from 'express'
import { createDepartment, assignHead, getDepartments } from './department.controller.js'
import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware.js'
import { Role } from '../user/schema/user.js'

const router = Router()

// Create department (only SUPER_ADMIN)
router.post('/create', authenticate, authorizeRoles(Role.SUPER_ADMIN), createDepartment)

// Assign head (only SUPER_ADMIN)
router.post('/assign-head', authenticate, authorizeRoles(Role.SUPER_ADMIN), assignHead)

// Get departments (any authenticated user)
router.get('/', authenticate, getDepartments)

export default router
