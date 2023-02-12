import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false)
    await mongoose.connect('mongodb://127.0.0.1/proShop')
    console.log(`Database connected successfully`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
