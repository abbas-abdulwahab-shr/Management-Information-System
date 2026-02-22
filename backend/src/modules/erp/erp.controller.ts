import { Response } from 'express'
import { AuthRequest } from '../../middlewares/auth.middleware.js'
import { Program } from '../program/schema/program.js'
import { AuditAction } from '../auditLogs/schema/auditLog.js'
import { transformERPProject, ExternalERPProject } from './erp.adapter.js'
import mongoose from 'mongoose'

const AuditLog = mongoose.model(
  'AuditLog',
  new mongoose.Schema({
    actionType: String,
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    entityType: String,
    entityId: mongoose.Schema.Types.ObjectId,
    metadata: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
  }),
)

export const syncProjects = async (req: AuthRequest, res: Response) => {
  try {
    const { projects } = req.body // expects array of external ERP projects
    if (!Array.isArray(projects)) {
      return res.status(400).json({ message: 'Projects array required.' })
    }
    const transformed = projects.map(transformERPProject)
    const created = await Program.insertMany(transformed)
    // Log sync
    await AuditLog.create({
      actionType: AuditAction.ERP_SYNC,
      performedBy: req.user?.id,
      entityType: 'Program',
      entityId: created[0]?._id,
      metadata: { count: created.length },
    })
    res.status(201).json({ message: 'ERP projects synced.', count: created.length })
  } catch (error) {
    res.status(500).json({ message: 'ERP sync failed.', error })
  }
}
