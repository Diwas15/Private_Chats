import mongoose from 'mongoose';
import { messageSchema } from './Messages.js';
const user = new mongoose.Schema({
    username:String,
    photo:String
})
const friendCard = new mongoose.Schema({
    user1:String,
    user2:String,
    lastMessage:{
        type:messageSchema,
        default:{}
    },
    
});

friendCard.index({user1:1,user2:1},{unique:true});

 export default mongoose.model('FriendCard',friendCard)