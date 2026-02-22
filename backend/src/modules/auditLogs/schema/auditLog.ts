import { Schema, model, Types } from 'mongoose'

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  ERP_SYNC = 'ERP_SYNC',
}

export interface IAuditLog {
  actionType: AuditAction
  performedBy: Types.ObjectId
  entityType: string
  entityId: Types.ObjectId
  metadata?: Record<string, any>
  createdAt: Date
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    actionType: {
      type: String,
      enum: Object.values(AuditAction),
      required: true,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    entityType: {
      type: String,
      required: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

export const AuditLog = model<IAuditLog>('AuditLog', auditLogSchema)
