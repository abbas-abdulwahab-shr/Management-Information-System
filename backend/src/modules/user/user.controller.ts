import { Response, Request } from 'express'
import { AuthRequest } from '../../middlewares/auth.middleware.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from './schema/user.js'
import { AuditLog, AuditAction } from '../auditLogs/schema/auditLog.js'
import { setupConfig } from '../../configs/env.js'

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, role, department } = req.body
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' })
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use.' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      department,
    })
    await AuditLog.create({
      actionType: AuditAction.CREATE,
      performedBy: user._id,
      entityType: 'User',
      entityId: user._id,
      metadata: { email: user.email, role: user.role },
    })
    res.status(201).json({
      message: 'User registered successfully.',
      user: { id: user._id, email: user.email, role: user.role },
    })
  } catch (error) {
    res.status(500).json({ message: 'Registration failed.', error })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required.' })
    }
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' })
    }
    const token = jwt.sign({ id: user._id, role: user.role }, setupConfig.JWT_SECRET, {
      expiresIn: '1d',
    })
    res
      .status(200)
      .json({ token, user: { id: user._id, email: user.email, role: user.role } })
  } catch (error) {
    res.status(500).json({ message: 'Login failed.', error })
  }
}

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }
    res.status(200).json({ user })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile.', error })
  }
}

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, password } = req.body
    const updateData: any = {}
    if (firstName) updateData.firstName = firstName
    if (lastName) updateData.lastName = lastName
    if (password) updateData.password = await bcrypt.hash(password, 10)
    const user = await User.findByIdAndUpdate(req.user?.id, updateData, {
      new: true,
    }).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }
    await AuditLog.create({
      actionType: AuditAction.UPDATE,
      performedBy: req.user?.id,
      entityType: 'User',
      entityId: user._id,
      metadata: { updatedFields: Object.keys(updateData) },
    })
    res.status(200).json({ message: 'Profile updated.', user })
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile.', error })
  }
}

export const deleteProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.user?.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }
    await AuditLog.create({
      actionType: AuditAction.DELETE,
      performedBy: req.user?.id,
      entityType: 'User',
      entityId: user._id,
      metadata: { email: user.email },
    })
    res.status(200).json({ message: 'Profile deleted.' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete profile.', error })
  }
}

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select('-password')
    res.status(200).json({ users })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users.', error })
  }
}
