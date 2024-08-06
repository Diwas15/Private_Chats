import React,{useContext} from 'react';
import { StyleSheet, View, Text, } from 'react-native';
import { userContext } from '../../Contexts/UserContext';

const Chat = (props) => {

    const context = useContext(userContext);

    return (
        <View id={props.msg._id} style={[styles.chat,props.msg.sender==context.user?styles.sender:'']}>
            <Text style={[props.msg.sender==context.user?{color:'white'}:'',{fontSize:15,fontWeight:500}]}>{props.msg.message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    chat:{
        position:'relative',
        backgroundColor:'#DCDDDC',
        width:'auto',
        maxWidth:250 ,
        borderRadius:15,
        zIndex:2000,
        padding:10,
        alignSelf:'flex-start' ,
        margin:10,
        marginBottom:0,
        justifyContent:'center'
    },
    sender:{
        marginLeft:'auto',
        backgroundColor:'#00A3FC',
    },
})

export default Chat;
