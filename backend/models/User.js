import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isadmin : { type: Boolean, default: false },
    country : { type: String, default: "USA" }  
},{timestamps:true});

const User = mongoose.model('AssUser', userSchema);

export default User;