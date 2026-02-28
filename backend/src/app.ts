import express from 'express'
import cors from 'cors'
import { errorMiddleware } from './middlewares/errorhanding.middleware.js'
import userRoutes from './modules/user/user.routes.js'
import programRoutes from './modules/program/program.routes.js'
import departmentRoutes from './modules/department/department.routes.js'
import budgetRoutes from './modules/budget/budget.routes.js'
import reportRoutes from './modules/report/report.routes.js'
import auditLogRoutes from './modules/auditLogs/auditlog.routes.js'
import erpRoutes from './modules/erp/erp.routes.js'
import { dashboardSSE } from './modules/dashboard/dashboard.sse.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/user', userRoutes)
app.use('/api/program', programRoutes)
app.use('/api/department', departmentRoutes)
app.use('/api/budget', budgetRoutes)
app.use('/api/report', reportRoutes)
app.use('/api/auditlog', auditLogRoutes)
app.use('/api/erp', erpRoutes)

app.get('/api/dashboard/stream', dashboardSSE)
app.use(errorMiddleware)

export default app
