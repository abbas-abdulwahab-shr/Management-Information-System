import { Response } from 'express'
import { AuthRequest } from '../../middlewares/auth.middleware.js'
import { AuditLog } from './schema/auditLog.js'

export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    const { entityType, actionType, performedBy, limit = 20 } = req.query
    const filter: any = {}
    if (entityType) filter.entityType = entityType
    if (actionType) filter.actionType = actionType
    if (performedBy) filter.performedBy = performedBy
    const logs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate('performedBy', 'firstName lastName email role')
    res.status(200).json({ logs })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch audit logs.', error })
  }
}
