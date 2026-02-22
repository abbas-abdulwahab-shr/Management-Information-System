import mongoose from 'mongoose'
import app from './app.js'
import { setupConfig } from './configs/env.js'

console.log('Running in:', setupConfig.ENV)

async function startServer() {
  try {
    await mongoose.connect(setupConfig.MONGO_URI)
    console.log('MongoDB connected')

    app.listen(setupConfig.PORT, () => {
      console.log(`Server running on port ${setupConfig.PORT}`)
    })
  } catch (error) {
    console.error('Startup error:', error)
    process.exit(1)
  }
}

startServer()
