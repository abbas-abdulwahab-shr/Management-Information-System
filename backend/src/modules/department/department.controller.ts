import { Response } from 'express'
import { AuthRequest } from '../../middlewares/auth.middleware.js'
import { User, Role } from '../user/schema/user.js'
// import { Program } from '../../modelSchema/program.js'
import { Department, IDepartment } from './schema/department.js'
import { AuditLog, AuditAction } from '../auditLogs/schema/auditLog.js'

export const createDepartment = async (req: AuthRequest, res: Response) => {
  try {
    const { name, headId } = req.body
    if (!name) {
      return res.status(400).json({ message: 'Department name required.' })
    }
    const department = await Department.create({ name, head: headId, programs: [] })
    await AuditLog.create({
      actionType: AuditAction.CREATE,
      performedBy: req.user?.id || (headId ?? null),
      entityType: 'Department',
      entityId: department._id,
      metadata: { name, head: headId },
    })
    res.status(201).json({ message: 'Department created.', department })
  } catch (error) {
    res.status(500).json({ message: 'Failed to create department.', error })
  }
}

export const assignHead = async (req: AuthRequest, res: Response) => {
  try {
    const { departmentId, headId } = req.body
    const department = await Department.findByIdAndUpdate(
      departmentId,
      { head: headId },
      { returnDocument: 'after' },
    )
    if (!department) {
      return res.status(404).json({ message: 'Department not found.' })
    }
    await User.findByIdAndUpdate(headId, { role: Role.DEPARTMENT_HEAD })
    await AuditLog.create({
      actionType: AuditAction.UPDATE,
      performedBy: req.user?.id || headId,
      entityType: 'Department',
      entityId: department._id,
      metadata: { head: headId },
    })
    res.status(200).json({ message: 'Head assigned.', department })
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign head.', error })
  }
}

export const getDepartments = async (req: AuthRequest, res: Response) => {
  try {
    const departments = await Department.find()
      .populate('head', 'firstName lastName email role')
      .populate({
        path: 'programs',
        select: 'title status startDate endDate',
        populate: {
          path: 'officer',
          select: 'firstName lastName email role',
        },
      })
    res.status(200).json({ departments })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch departments.', error })
  }
}

export const getDepartmentDetail = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const department = await Department.findById(id)
      .populate('head', 'firstName lastName email role')
      .populate({
        path: 'programs',
        select: 'title status startDate endDate',
        populate: {
          path: 'officer',
          select: 'firstName lastName email role',
        },
      })
    if (!department) {
      return res.status(404).json({ message: 'Department not found.' })
    }
    // Calculate staff count
    const staffCount = await User.countDocuments({ department: department._id })
    res.status(200).json({
      id: department._id,
      name: department.name,
      head: department.head || undefined,
      programs: department.programs || [],
      staffCount,
      createdAt: department.createdAt,
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch department detail.', error })
  }
}
