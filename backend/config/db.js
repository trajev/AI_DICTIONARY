const mongoose = require('mongoose');

async function connectDB(){

  try{
    const conn = await mongoose.connect( process.env.MONGO_URI );
    console.log( "MongoDB connected successfully", conn.connection.host  );
  }
  catch(err){
    console.log( "Error occurred at connecting mongodb - ", err.message );
  }

}

module.exports = connectDB;