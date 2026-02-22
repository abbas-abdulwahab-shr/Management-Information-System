import { Schema, model, Types } from 'mongoose'

export enum ProgramStatus {
  PLANNED = 'PLANNED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  SUSPENDED = 'SUSPENDED',
}

export interface IProgram {
  title: string
  description?: string
  status: ProgramStatus
  officerId: Types.ObjectId
  startDate: Date
  endDate?: Date
  budgetId?: Types.ObjectId
  createdBy: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const programSchema = new Schema<IProgram>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(ProgramStatus),
      default: ProgramStatus.PLANNED,
    },
    officerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    budgetId: {
      type: Schema.Types.ObjectId,
      ref: 'Budget',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
)

export const Program = model<IProgram>('Program', programSchema)
