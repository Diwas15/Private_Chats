import { io } from 'socket.io-client';
// "undefined" means the URL will be computed from the `window.location` object
const URL =  'https://privatechats-backend1.onrender.com';


export const socket = io(URL,{
    autoConnect:false,
    transports: ['websocket', 'polling', 'flashsocket'],
    query:{
        user:''
    }
});