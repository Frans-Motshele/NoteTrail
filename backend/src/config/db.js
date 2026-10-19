import mongoose from 'mongoose'

export const connectdb = async() => {
try{
    await mongoose.connect(process.env.Mongo_url )
    console.log("MongoDB connected successfully")
}catch(error){
    console.error("Error connecting to MongoDB:", error)
    process.exit(1)
}

}