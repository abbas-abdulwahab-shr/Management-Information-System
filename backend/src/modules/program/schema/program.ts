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
  primarySponsor?: Types.ObjectId
  supportingSponsor?: Types.ObjectId
  departmentId: Types.ObjectId
  impact?: string
  beneficiaries?: number
  location?: string
  startDate: Date
  endDate?: Date
  budget?: string
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
    primarySponsor: {
      type: String,
    },
    supportingSponsor: {
      type: String,
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    impact: {
      type: String,
    },
    beneficiaries: {
      type: Number,
    },
    location: {
      type: String,
    },
    budget: {
      type: String,
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
