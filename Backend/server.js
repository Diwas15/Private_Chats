import express, { query } from  'express';
import {createServer} from 'node:http';
import {Server} from 'socket.io';
import FriendCard from './Schemas/FriendCards.js ';
import Messages from './Schemas/Messages.js';
import { Message, SMTPClient } from 'emailjs';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import FriendCards from './Schemas/FriendCards.js';

const app  = express();
const server = createServer(app);
const io = new Server(server,{
    cors: {
        origin: "http://localhost:8081",
      }
});

const SECRET_KEY = `MIICXgIBAAKBgQCo0Xod6OYz4XL2YYA+Po3dRBrMXKA/fddOoUf2awSZzwEs1p9c
NPI7Oys8Mww2vxmIYZWfPU6cKdI/fHT0iBupxckcoFePp9Wi++PvcG+wYqtvZn9g
0lU8OiCi9pCzmyNtHZSkiAuUXmqYQ23Kj1SI5mKuK1D2ueA7h/QIHdczfwIDAQAB
AoGBAKEq84Gwgm2PU7jCVrOV9swCI+9skpRq6G2p7dDkVI0eokmTUKqv5X4Eu/8J
4SQ3BwI736MZ3X2bM5zmjaWSd4znlvtl7iNWGN7K6gGNQdVorU49bhAT18gURBnY
1o9RpgYUAzrthvlba+JjtT5CO9zGifnphG8IiR/rEj/9vvB5AkEA9mEY4hzlPHfL
OWvDaOZ47kMrUiZLCe4awpf0ezKIAJ/gQPRUByHK37UEUM8CjHPR1LQhKrc80SBP
MWxyZW7VswJBAK9pDMLoY/Ph5mzEbfkP+KA6ybmWKaGyXyoHor09vVNWvn0lrDSv
1omTXEuW/KXc1hLcejDxBcrY+F7iTtVJXQUCQQDj4werDWMTPRKiOAT04Eh2yXYm
c/jwZGYoG3ktAp49RaOdMOEP/7ewl7Q4MmF/HBm3ji0nX3lHTYUyh8Z//7Z1AkEA
m54ZAjnloxJAuTIzVokCzDQbjxhXauqyXrlTeYxykKMecCyh8EQnkvo3IaCcGBIp
oaYUiaLqvqFrB9LCmZpyeQJAfj+FmtXowmZsrNXKLJqWqC/0nQnKZZJur4YCjIjd
iqdJTKKhK4V1YQfgklbz2C0A0XmdXfhF6iuQq1iAGAUoHg==`;

const client = new SMTPClient({
  user:'satidiwas@gmail.com',
  password:'wtzh gvij lulp sktb',
  host:'smtp.gmail.com',
  ssl:true
})

//----------------------------------------db connection----------------------------------------------------

const url = 'mongodb+srv://satidiwas:TR49G"We(YUEyQ4@cluster0.is8pr7k.mongodb.net/Major_Project?retryWrites=true&w=majority'
mongoose.connect(url).then(()=>console.log("Connection successful")).catch((err)=>console.log(err));

//-----------------------------------------middlewares-----------------------------------------------------

app.use(express.json())
//app.use(bodyParser.urlencoded({extended:true}))


let userSockets = {};
let count = 0;

io.on('connection',function (socket)  {
    console.log('a user connected');
    console.log("id : "+socket.id);
    
    socket.on('secretID', (user) => {
      count++;
      userSockets[user]=socket.id;
      console.log(count);
      console.log(userSockets)
      
    });
  
    
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  
  });
  
  async function func(msg){
      const sockets = await io.fetchSockets();
      console.log(sockets);
      //io.to(sockets[1].id).emit('receive',msg);
  }
  

//--------------------------------------------otp generater ----------------------------------------------------------------
let otps = {};
const otpGenerator = ()=>{
  let digits = '0123456789'; 
  let OTP = ''; 
  let len = digits.length 
  for (let i = 0; i < 4; i++) { 
      OTP += digits[Math.floor(Math.random() * len)]; 
  } 
   
  return OTP; 
}


app.post('/generate',(req,res)=>{
  //console.log(req.body.email);
  let user = req.body.email;
  let temp = otpGenerator();
  otps[user] = temp;
  client.send(
    {
      text: `This is your OTP for authentication : ${temp}.
      DO NOT SHARE WITH ANYONE`,
      from: 'satidiwas@gmail.com',
      to: user,
      //cc: 'else <else@your-email.com>',
      subject: 'Chats OTP Verification',
    },
    (err, message) => {
      console.log(err || message);
    }
  );

  res.status(200).send();
})

///-------------------------------------------verify otp-----------------------------------------------

app.post('/verify',(req,res)=>{
  //console.log(req.body.code);
  //console.log(req.body.user);
  let check = req.body.code;
  let user = req.body.user;
  if(check == otps[user]){
    const token = jwt.sign({ user:user}, SECRET_KEY, {expiresIn:'15 days'});
    // console.log(token);
    res.status(200).send(JSON.stringify({token:token}));
  }
  else
    return res.status(400).send();

})


//--------------------------------------------add friends----------------------------------------------------


app.post('/addFriend',(req,res)=>{
  let user1 = req.body.user1;
  let user2 = req.body.user2;
  FriendCard.create({user1:user1,user2:user2});
  res.status(200).send();
})

//--------------------------------------------send message---------------------------------------------------


app.post('/sendMessage',(req,res)=>{
  let sender = req.body.sender;
  let receiver = req.body.receiver;
  let msg = req.body.message;
  
  // io.to(userSockets[receiver]).emit('receive',dat);
  
  Messages.create({sender:sender,receiver:receiver,message:msg}).then((data)=>{
    // console.log(data);
    io.to(userSockets[receiver]).emit('receive',data);

    io.to(userSockets[sender]).emit('lastUpdate',data);

    res.status(200).send(data);
    FriendCard.findOneAndUpdate({$or:[{user1:sender,user2:receiver},{user1:receiver,user2:sender}]},{$set:{lastMessage:data}},{new:true}).then((data)=>{
      
    }).catch((err)=>console.log(err))

    
  }).catch((err)=>console.log(err));
  
  
})


//--------------------------------------------fetch friends--------------------------------------------------

app.post('/fetchFriends',(req,res)=>{
  let user = req.body.user;

  FriendCard.find({$or:[{user1:user},{user2:user}]}).then((data)=>{
    console.log(data);
    res.status(200).send(data);
  }).catch((err)=>{
    console.log(err);
    res.status(500).send(err);
  })
})


//---------------------------------------------------get recent messages-----------------------------------------------


app.post('/getRecentMessages',(req,res)=>{
  let user1 = req.body.user1;
  let user2 = req.body.user2;

  Messages.find({$or:[{sender:user1,receiver:user2},{sender:user2,receiver:user1}]}).sort({createdAt:-1}).limit(20).exec().then((data)=>{
    // console.log(data);

    res.status(200).send(data);
  }).catch((err)=>{
    console.log(err);
    res.status(401).send(err);
  })
})


//---------------------------------------------get Old messages----------------------------------------------------

app.post('/getOldMessages',(req,res)=>{
  let user1 = req.body.user1;
  let user2 = req.body.user2;
  let lastId = req.body.lastId;
  let createdAt = req.body.createdAt;
  console.log(lastId);

  Messages.find({createdAt:{$lte:createdAt}, _id:{$ne:lastId}, $or:[{sender:user1,receiver:user2},{sender:user2,receiver:user1}]}).sort({createdAt:-1}).limit(5).exec().then((data)=>{
    console.log(data);
    res.status(200).send(data);
  }).catch((err)=>{
    console.log(err);
  })

  
})




  server.listen(9000,'0.0.0.0', () => {
    console.log('server running at http://localhost:9000');
  });