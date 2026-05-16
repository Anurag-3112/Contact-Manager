const mongoose = require("mongoose");

const connectDB = async () =>{
    try{
        mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("MongoDB Connected"));
    }
    catch(err){
        console.log("MongoDB Error:", err);
        process.exit(1);
    }
};

module.exports= connectDB;