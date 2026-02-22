import { Router } from 'express'
import { summaryStats, projectsPerDepartment, activeUsers } from './report.controller.js'
import { authenticate } from '../../middlewares/auth.middleware.js'

const router = Router()

router.get('/summary', authenticate, summaryStats)
router.get('/projects-per-department', authenticate, projectsPerDepartment)
router.get('/active-users', authenticate, activeUsers)

export default router
