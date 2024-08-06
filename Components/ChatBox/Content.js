import React, {useContext, useState, useRef, useEffect} from 'react';
import { ScrollView, StyleSheet, View, KeyboardAvoidingView, Text, Dimensions } from 'react-native';
import { userContext } from '../../Contexts/UserContext';
import { chatBoxContext } from '../../Contexts/chatBoxContext';
import Chat from './Message';

//onContentSizeChange={(width,height) => scrollViewRef.current.scrollTo({x:width,y:height, animated: true })}

const Content = () => {
    const context = useContext(userContext);
    const chatContext = useContext(chatBoxContext);
    const scrollViewRef = useRef(null);
    const [id,setId] = useState(0);
    
    function getOldMessages(e){
        fetch('https://privatechats-backend1.onrender.com/getOldMessages',{
            method:'POST',
            body:JSON.stringify({
                user1:context.user,
                user2:chatContext.friend,
                lastId:chatContext.messages.at(-1)._id,
                createdAt:chatContext.messages.at(-1).createdAt
            }),
            headers:{
                "Content-Type":"application/json"
            }
        }).then((res)=>res.json().then((data)=>{
            if(data.length!=0){
                chatContext.setMessages([...chatContext.messages,...data]);
            }
        }).catch((err)=>{
            console.log("conversion error");
        })).catch((err)=>{
            console.log("data hi nai mila");
        })
    }
  


    return (
        <KeyboardAvoidingView style={{flex:1}} behavior='position'>
            <ScrollView scrollsToTop={false} ref={scrollViewRef} contentContainerStyle={{paddingBottom: 15}} keyboardDismissMode='on-drag' style={!context.changeMode?styles.content:[styles.content,{backgroundColor:'black'}]}    
            onContentSizeChange={(width,height)=>  {scrollViewRef.current.scrollTo({x:width,y:height-id,animated: false});setId(height);}}
            onMomentumScrollEnd={(e)=>{
                if(e.nativeEvent.contentOffset.y==0){
                    getOldMessages();
                }
            }} >
                    {
                        chatContext.messages.toReversed().map((obj)=>{
                            return <Chat msg={obj}/>
                        })   
                    }
                
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    content:{
        backgroundColor:'white',
        // borderWidth:1,
        paddingTop:10,
        paddingHorizontal:4
        
    }
})

export default Content;
