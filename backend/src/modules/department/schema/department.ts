import { Schema, model, Types } from 'mongoose'

export interface IDepartment {
  name: string
  head?: Types.ObjectId
  programs: Types.ObjectId[]
  createdAt: Date
}

const departmentSchema = new Schema<IDepartment>({
  name: { type: String, required: true, unique: true },
  head: { type: Schema.Types.ObjectId, ref: 'User' },
  programs: [{ type: Schema.Types.ObjectId, ref: 'Program' }],
  createdAt: { type: Date, default: Date.now },
})

export const Department = model<IDepartment>('Department', departmentSchema)
