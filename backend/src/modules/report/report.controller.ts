import { Request, Response } from 'express'
import { Program } from '../program/schema/program.js'
import { User } from '../user/schema/user.js'

export const summaryStats = async (_req: Request, res: Response) => {
  try {
    const totalPrograms = await Program.countDocuments()
    const totalUsers = await User.countDocuments()
    res.status(200).json({ totalPrograms, totalUsers })
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate summary.', error })
  }
}

export const projectsPerDepartment = async (_req: Request, res: Response) => {
  try {
    const data = await Program.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'officerId',
          foreignField: '_id',
          as: 'officer',
        },
      },
      {
        $unwind: '$officer',
      },
      {
        $group: {
          _id: '$officer.department',
          projects: { $push: '$title' },
          count: { $sum: 1 },
        },
      },
    ])
    res.status(200).json({ projectsPerDepartment: data })
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate report.', error })
  }
}

export const activeUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find({ isActive: true })
    res.status(200).json({ activeUsers: users })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch active users.', error })
  }
}
