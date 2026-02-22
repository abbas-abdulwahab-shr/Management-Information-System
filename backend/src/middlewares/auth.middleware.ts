import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User, Role } from '../modules/user/schema/user.js'
import { setupConfig } from '../configs/env.js'

export interface AuthRequest extends Request {
  user?: {
    id: string
    role: Role
  }
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided.' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, setupConfig.JWT_SECRET) as {
      id: string
      role: Role
    }
    req.user = { id: decoded.id, role: decoded.role }
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' })
  }
}

export const authorizeRoles = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient role.' })
    }
    next()
  }
}
