import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
    country : { type: String, required: true },
    content : { type: String, default: '' },

},{timestamps:true});

const Data = mongoose.model('assData', dataSchema);

export default Data;