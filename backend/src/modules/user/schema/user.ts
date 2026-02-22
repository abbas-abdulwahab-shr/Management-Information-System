import mongoose, { Schema, Document } from 'mongoose'

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  DEPARTMENT_HEAD = 'DEPARTMENT_HEAD',
  ANALYST = 'ANALYST',
  OFFICER = 'OFFICER',
}

export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  password: string
  role: Role
  department?: mongoose.Types.ObjectId
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // 🔥 Important for security
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.OFFICER,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

export const User = mongoose.model<IUser>('User', userSchema)
