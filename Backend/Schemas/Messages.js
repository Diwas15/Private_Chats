import mongoose, { Schema } from 'mongoose';

const messageSchema = mongoose.Schema({
    sender:String,
    receiver:String,
    message:{
        type:String,
        default:""
    }
},{timestamps:true});

export default new mongoose.model('Message',messageSchema);

export {messageSchema}