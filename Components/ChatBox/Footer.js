import React, { useContext, useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Image, Pressable, Dimensions } from 'react-native';
import { userContext } from '../../Contexts/UserContext';
import send from '../../assets/images/send.png'
import { chatBoxContext } from '../../Contexts/chatBoxContext';
import { socket } from '../../socket';

const Footer = () => {
    const context = useContext(userContext);
    const chatContext = useContext(chatBoxContext);
    const win_width = Dimensions.get('window').width;
    const win_height = Dimensions.get('window').height;

    const [msg,setMsg] = useState("");

    const sendMessage = ()=>{
        // console.log(msg);
        let dat = msg;
        setMsg("");
        

        fetch('https://privatechats-backend1.onrender.com/sendMessage',{
            method:"POST",
            body:JSON.stringify({
                sender:context.user,
                receiver:chatContext.friend,
                message:dat
            }),
            headers:{
                "Content-Type":"application/json"
            }
        }).then((res)=>res.json().then((data)=>{
            // console.log(data)
            chatContext.setMessages(()=>[data,...chatContext.messages]);
            
        })).catch((err)=>{
            console.log(err);
        })
    }

    
    return (
        <View style={!context.changeMode?styles.footer:[styles.footer,{backgroundColor:'black'}]}>
            <View style={styles.text_box}>
                <TextInput style={[{width:win_width-60,height:win_height/24},context.changeMode?styles.writer_white:styles.writer_black]} value={msg} selectionColor={'#00A3FC'} onChangeText={(text)=>{
                    setMsg(text);
                }}/>
            </View>
            <Pressable onPress={sendMessage}>
                <View style={styles.send_btn}>
                    <Image source={send} style={{height:25,width:25}}/>
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    footer:{
        height:55,
        borderTopWidth:.2,
        borderColor:'#3E3E3E',
        padding:5,
        paddingLeft:10,
        paddingRight:10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
        // borderWidth:1
    },
    
    writer_white:{
        backgroundColor:'#2A2A2A',
        borderRadius:50,
        padding:10,
        // fontSize:18,
        color:'white'
        
        
    },
    writer_black:{
        backgroundColor:'white',
        borderWidth:.5,
        borderColor:'gray',
        borderRadius:50,
        padding:10,
        // fontSize:18,
        color:'gray',
        
        
    },
    
    send_btn:{
        right:-10
    }
})

export default Footer;
