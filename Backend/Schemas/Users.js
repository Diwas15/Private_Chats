import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username:{
        String,
        required:true},
    image:{type:String,
        default:''
    },
    
});
export default new mongoose.model('User',userSchema);