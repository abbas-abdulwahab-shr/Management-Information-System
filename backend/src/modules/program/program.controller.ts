// Get single program detail
import { Response } from 'express'
import { AuthRequest } from '../../middlewares/auth.middleware.js'
import { Program, ProgramStatus } from './schema/program.js'
import { User } from '../user/schema/user.js'
import { AuditLog, AuditAction } from '../auditLogs/schema/auditLog.js'

export const createProgram = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      officerId,
      primarySponsor,
      supportingSponsor,
      departmentId,
      startDate,
      endDate,
      budget,
      impact,
      beneficiaries,
      location,
    } = req.body
    if (!title || !officerId || !departmentId || !startDate) {
      return res.status(400).json({ message: 'Missing required fields.' })
    }
    // Validate ObjectId format
    const isValidObjectId = (id: string) => /^[a-fA-F0-9]{24}$/.test(id)
    if (!isValidObjectId(officerId) || !isValidObjectId(departmentId)) {
      return res
        .status(400)
        .json({ message: 'Invalid officerId or departmentId format.' })
    }
    const officer = await User.findById(officerId)
    if (!officer) {
      return res.status(404).json({ message: 'Officer not found.' })
    }
    // Create program with all fields
    const program = await Program.create({
      title,
      description,
      officerId,
      primarySponsor,
      supportingSponsor,
      departmentId,
      status: ProgramStatus.PLANNED,
      startDate,
      endDate,
      budget,
      impact,
      beneficiaries,
      location,
      createdBy: req.user?.id || officerId,
    })
    await AuditLog.create({
      actionType: AuditAction.CREATE,
      performedBy: req.user?.id || officerId,
      entityType: 'Program',
      entityId: program._id,
      metadata: { title, officerId, departmentId },
    })
    res.status(201).json({ message: 'Program created.', program })
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
    const programs = await Program.find().populate('officerId')
    res.status(200).json({ programs })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch programs.', error })
  }
}

export const getProgramDetail = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    // Validate ObjectId format
    const isValidObjectId = (id: string) => /^[a-fA-F0-9]{24}$/.test(id)
    if (!isValidObjectId(id as string)) {
      return res.status(400).json({ message: 'Invalid program ID format.' })
    }
    const program = await Program.findById(id)
      .populate('officerId')
      .populate('departmentId')
    if (!program) {
      return res.status(404).json({ message: 'Program not found.' })
    }
    res.status(200).json({ program })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch program detail.', error })
  }
}
