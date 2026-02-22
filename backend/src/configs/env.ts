import dotenv from 'dotenv'

const environment = process.env.NODE_ENV || 'local'
dotenv.config({ path: `.env.${environment}` })

export const setupConfig = {
  MONGO_URI: process.env.MONGO_URI as string,
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET as string,
  ENV: environment,
}
