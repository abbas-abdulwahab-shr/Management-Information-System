import { Schema, model, Types } from 'mongoose'

export interface IBudget {
  programId: Types.ObjectId
  allocatedAmount: number
  spentAmount: number
  currency: string
  lastSyncedWithERP?: Date
  createdAt: Date
  updatedAt: Date
}

const budgetSchema = new Schema<IBudget>(
  {
    programId: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
      unique: true, // one-to-one relationship
    },
    allocatedAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    spentAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    lastSyncedWithERP: {
      type: Date,
    },
  },
  { timestamps: true },
)

export const Budget = model<IBudget>('Budget', budgetSchema)
