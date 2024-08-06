import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, KeyboardAvoidingView, StatusBar} from 'react-native';
import Header from '../Components/Home/Header';
import ContactInfo from '../Components/ChatBox/ContactInfo';
import Content from '../Components/ChatBox/Content';
import Footer from '../Components/ChatBox/Footer';
import KeyboardListener from 'react-native-keyboard-listener';
import { userContext } from '../Contexts/UserContext';
import { chatBoxContext } from '../Contexts/chatBoxContext';
import {cardContext } from '../Contexts/CardContext';
import { socket } from '../socket';

import { Platform, NativeModules } from 'react-native';
const { StatusBarManager } = NativeModules;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 60 : 0;

const Home = (props) => {
    const context = useContext(userContext);
    const card = useContext(cardContext);
    const win_width = Dimensions.get('window').width;
    const win_height = Dimensions.get('window').height;
    const [friend,setFriend] = useState(props.obj.user1==context.user?props.obj.user2:props.obj.user1);
    const [messages,setMessages] = useState([]);
    const [id,setId] = useState(props.obj._id);


    socket.on('receive', function(reply){
        // console.log("bhulla")
        if(reply.sender==friend){
            setMessages(()=>[reply,...messages]);

            
        }
    });

    useEffect(()=>{
        fetch('https://privatechats-backend1.onrender.com/getRecentMessages',{
            method:'POST',
            body:JSON.stringify({
                user1:context.user,
                user2:friend
            }),
            headers:{
                "Content-Type":"application/json"
            }
        }).then((res)=>res.json().then((data)=>{
            // console.log(data);
            setMessages([...data]);
            
            // console.log("MESSAGES IN HUSA KYA????????");
            // console.log(messages);
        }))
    },[])


    return (
        <chatBoxContext.Provider value={{friend,setFriend,messages,setMessages,id,setId}}>
            <View style={[styles.show,{top:STATUSBAR_HEIGHT,height:Platform.OS=="android"?win_height-20:win_height-90,width:win_width},context.clickedId==id?'':styles.not_show]}>
                <ContactInfo />
                <KeyboardAvoidingView style={{flex:1}} behavior='padding' keyboardVerticalOffset={58}>
                        <View style={{flex:1}}>
                        <Content />
                        <Footer />
                        </View>
                </KeyboardAvoidingView>
            </View>
        </chatBoxContext.Provider>
    );
}

const styles = StyleSheet.create({
    home_box:{
       
        
    },
    show:{
        display:'block',
        position:'absolute',
        backgroundColor:'white',
        // borderWidth:2 ,
        // borderColor:'red',
        flex:1,
        zIndex:2000,
    },
    not_show:{
        left:480
    }
    
})

export default Home;
