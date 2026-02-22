import { Response } from 'express'
import { AuthRequest } from '../../middlewares/auth.middleware.js'
import { Program, ProgramStatus } from './schema/program.js'
import { Budget } from '../budget/schema/budget.js'
import { User } from '../user/schema/user.js'
import { AuditLog, AuditAction } from '../auditLogs/schema/auditLog.js'

export const createProgram = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, officerId, departmentId, startDate, endDate, budgetId } =
      req.body
    if (!title || !officerId || !departmentId || !startDate) {
      return res.status(400).json({ message: 'Missing required fields.' })
    }
    // Optionally validate officer and department
    const officer = await User.findById(officerId)
    if (!officer) {
      return res.status(404).json({ message: 'Officer not found.' })
    }
    const program = await Program.create({
      title,
      description,
      officerId,
      status: ProgramStatus.PLANNED,
      startDate,
      endDate,
      createdBy: req.user?.id || officerId,
    })
    // Auto-create a budget for the new program
    const budget = await Budget.create({
      programId: program._id,
      allocatedAmount: 0,
      spentAmount: 0,
      currency: 'USD',
    })
    // Link budget to program
    program.budgetId = budget._id
    await program.save()
    await AuditLog.create({
      actionType: AuditAction.CREATE,
      performedBy: req.user?.id || officerId,
      entityType: 'Program',
      entityId: program._id,
      metadata: { title, officerId, departmentId },
    })
    await AuditLog.create({
      actionType: AuditAction.CREATE,
      performedBy: req.user?.id || officerId,
      entityType: 'Budget',
      entityId: budget._id,
      metadata: { programId: program._id },
    })
    res.status(201).json({ message: 'Program and budget created.', program, budget })
  } catch (error) {
    res.status(500).json({ message: 'Failed to create program.', error })
  }
}

export const updateProgramStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body
    if (!status || !Object.values(ProgramStatus).includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' })
    }
    const program = await Program.findByIdAndUpdate(id, { status }, { new: true })
    if (!program) {
      return res.status(404).json({ message: 'Program not found.' })
    }
    await AuditLog.create({
      actionType: AuditAction.UPDATE,
      performedBy: req.user?.id,
      entityType: 'Program',
      entityId: program._id,
      metadata: { status },
    })
    res.status(200).json({ message: 'Status updated.', program })
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status.', error })
  }
}

export const getPrograms = async (req: AuthRequest, res: Response) => {
  try {
    const programs = await Program.find().populate('officerId').populate('budgetId')
    res.status(200).json({ programs })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch programs.', error })
  }
}
