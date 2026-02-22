import { Response } from 'express'
import { AuthRequest } from '../../middlewares/auth.middleware.js'
import { Budget } from '../budget/schema/budget.js'
import { AuditLog, AuditAction } from '../auditLogs/schema/auditLog.js'

export const createBudget = async (req: AuthRequest, res: Response) => {
  try {
    const { programId, allocatedAmount, currency } = req.body
    if (!programId || !allocatedAmount) {
      return res.status(400).json({ message: 'Program and amount required.' })
    }
    const budget = await Budget.create({
      programId,
      allocatedAmount,
      spentAmount: 0,
      currency: currency || 'USD',
    })
    await AuditLog.create({
      actionType: AuditAction.CREATE,
      performedBy: req.user?.id,
      entityType: 'Budget',
      entityId: budget._id,
      metadata: { programId, allocatedAmount, currency },
    })
    res.status(201).json({ message: 'Budget created.', budget })
  } catch (error) {
    res.status(500).json({ message: 'Failed to create budget.', error })
  }
}

export const getBudgets = async (_req: AuthRequest, res: Response) => {
  try {
    const budgets = await Budget.find().populate('programId', 'title status')
    res.status(200).json({ budgets })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch budgets.', error })
  }
}

export const updateBudget = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { allocatedAmount, spentAmount, currency } = req.body
    const budget = await Budget.findByIdAndUpdate(
      id,
      { allocatedAmount, spentAmount, currency },
      { new: true },
    )
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found.' })
    }
    await AuditLog.create({
      actionType: AuditAction.UPDATE,
      performedBy: req.user?.id,
      entityType: 'Budget',
      entityId: budget._id,
      metadata: { allocatedAmount, spentAmount, currency },
    })
    res.status(200).json({ message: 'Budget updated.', budget })
  } catch (error) {
    res.status(500).json({ message: 'Failed to update budget.', error })
  }
}

export const deleteBudget = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const budget = await Budget.findByIdAndDelete(id)
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found.' })
    }
    await AuditLog.create({
      actionType: AuditAction.DELETE,
      performedBy: req.user?.id,
      entityType: 'Budget',
      entityId: budget._id,
      metadata: {},
    })
    res.status(200).json({ message: 'Budget deleted.' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete budget.', error })
  }
}
