import React, { useContext, useState } from 'react';
import { StyleSheet, View, Image, Text, Pressable } from 'react-native';
import ChatBox from '../../Screens/ChatBox';
import { userContext } from '../../Contexts/UserContext';
import { socket } from '../../socket';

const ContactCard = (props) => {
    const context = useContext(userContext);

    const [friend,setFriend] = useState(props.obj.user1==context.user?props.obj.user2:props.obj.user1);
    const [lastMessage,setLastMessage] = useState(props.obj.lastMessage.message);
    socket.on('receive',function(reply){
        if(reply.sender==friend){
            setLastMessage(reply.message);
        }
    })
    socket.on('lastUpdate', function(reply){
        // console.log("last")
        if(reply.receiver==friend){
            //console.log(friend);
            setLastMessage(reply.message);
        }
    });
    return (
        <>
        
        <Pressable onPress={()=>{
            context.setClicked(true);
            context.setClickedId(props.obj._id);
        }}>
            <View style={styles.card}>
                <Image source={''} style={styles.image} />
                <View style={styles.info}>
                    <Text style={context.changeMode?{color:'white', fontWeight:'700',fontSize:18 , marginBottom:5}:{color:'black', fontWeight:'700', fontSize:18, marginBottom:5} }>{friend}</Text>
                    <Text style={context.changeMode?{color:'#838282', fontSize:16, fontWeight:'500'}:{color:'#838282', fontSize:16, fontWeight:'500'}}>{lastMessage} </Text>
                </View>
            </View>
        </Pressable>
        
        </>
    );
}

const styles = StyleSheet.create({
    card:{
        borderBottomWidth:.2,
        borderColor:'#3E3E3E',
        height:'fit-content',
        width:'fit-content',
        alignItems:'center',
        justifyContent:'left',
        flexDirection:'row',
        padding:15
    },
    image:{
        height:60,
        width:60,
        borderRadius:50,
        backgroundColor:'gray'
    },
    info:{
        borderWidth:0,
        height:60,
        marginLeft:10,
        
    }
})

export default ContactCard;
