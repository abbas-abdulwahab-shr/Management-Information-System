import { Request, Response } from 'express'
import {
  summaryStats,
  projectsPerDepartment,
  activeUsers,
} from '../report/report.controller.js'

// Simple in-memory list of clients
const clients: Response[] = []

export function dashboardSSE(req: Request, res: Response) {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  clients.push(res)

  // Send initial data
  Promise.all([
    summaryStats(req, res, true),
    projectsPerDepartment(req, res, true),
    activeUsers(req, res, true),
  ]).then(([summary, projects, users]) => {
    res.write(
      `event: dashboard\ndata: ${JSON.stringify({ summary, projects, users })}\n\n`,
    )
  })

  // Remove client on close
  req.on('close', () => {
    const idx = clients.indexOf(res)
    if (idx !== -1) clients.splice(idx, 1)
  })
}

// Call this function when DB changes
export function broadcastDashboardUpdate(data: any) {
  for (const client of clients) {
    client.write(`event: dashboard\ndata: ${JSON.stringify(data)}\n\n`)
  }
}
