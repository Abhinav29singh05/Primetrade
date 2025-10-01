import mongoose, { connect }from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function connectDB(){
    const uri = process.env.MONGO_URL;
    try{
        await mongoose.connect(uri, { useNewUrlParser:true, useUnifiedTopology:true });
        // console.log(uri);
        console.log("Connected to MongoDB");
    }catch(err){
        console.error(err.message);
        process.exit(1);
    }
}


export default connectDB;