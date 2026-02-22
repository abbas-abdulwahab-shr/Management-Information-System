import { Router } from 'express'
import { getAuditLogs } from './auditlog.controller.js'
import { authenticate } from '../../middlewares/auth.middleware.js'

const router = Router()

// GET /api/auditlog?entityType=User&actionType=CREATE&performedBy=...&limit=20
router.get('/', authenticate, getAuditLogs)

export default router
