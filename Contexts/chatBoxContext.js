import { createContext } from "react";

export const chatBoxContext = createContext({friend:'',setFriend:()=>{}, messages:[],setMessages:()=>{}})