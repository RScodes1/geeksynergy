const mongoose = require('mongoose');
require('dotenv').config()

const userSchema = new mongoose.Schema({
    username : {type: String},
    email : {type: String, unique : true, required: true},
    password : {type :String, required :true},
    phone :{type : Number},
    profession: {type : String},
     timeStamp : {type: Date, default: Date.now()},
   
}, { versionKey: false})

const UserModel = mongoose.model("user", userSchema);

module.exports = {
    UserModel
}