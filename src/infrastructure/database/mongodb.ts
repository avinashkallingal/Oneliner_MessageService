import mongoose from "mongoose";
import config from '../config/config'

export const connectToDatabase = async()=>{
    try{
        await mongoose.connect(config.dbURL);
        console.log('connected to database');
    }catch(error){
        console.log('db connection error',error);
    }
}