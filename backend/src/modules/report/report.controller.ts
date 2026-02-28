import { Request, Response } from 'express'
import { Program } from '../program/schema/program.js'
import { User } from '../user/schema/user.js'

// Internal helper
export const getSummaryStatsRaw = async () => {
  try {
    const totalPrograms = await Program.countDocuments()
    const totalUsers = await User.countDocuments()
    return { totalPrograms, totalUsers }
  } catch (error) {
    return { error }
  }
}

export const summaryStats = async (req: Request, res: Response) => {
  try {
    const stats = await getSummaryStatsRaw()
    if (stats.error) throw stats.error
    res.status(200).json(stats)
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate summary.', error })
  }
}

// Internal helper
export const getProjectsPerDepartmentRaw = async () => {
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
      { $unwind: '$officer' },
      {
        $group: {
          _id: '$officer.department',
          projects: { $push: '$title' },
          count: { $sum: 1 },
        },
      },
    ])
    return { projectsPerDepartment: data }
  } catch (error) {
    return { error }
  }
}

export const projectsPerDepartment = async (req: Request, res: Response) => {
  try {
    const result = await getProjectsPerDepartmentRaw()
    if (result.error) throw result.error
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate report.', error })
  }
}

// Internal helper
export const getActiveUsersRaw = async () => {
  try {
    const users = await User.find({ isActive: true })
    return { activeUsers: users }
  } catch (error) {
    return { error }
  }
}

export const activeUsers = async (req: Request, res: Response) => {
  try {
    const result = await getActiveUsersRaw()
    if (result.error) throw result.error
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch active users.', error })
  }
}
