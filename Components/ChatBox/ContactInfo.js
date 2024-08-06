import React, { useContext, useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import back from '../../assets/images/back.png'
import { userContext } from '../../Contexts/UserContext';
import { chatBoxContext } from '../../Contexts/chatBoxContext';

const ContactInfo = () => {
    const context = useContext(userContext);
    const chatContext = useContext(chatBoxContext);
    return (
        <View style={!context.changeMode?styles.header:[styles.header,{backgroundColor:'black'}]}>
            <TouchableOpacity onPress={()=>{
                context.setClicked(false);
                context.setClickedId('');
            }}>
                <Image source={back} style={styles.back}/>
            </TouchableOpacity>
            <Image style={styles.icon}/>
            <Text style={context.changeMode?styles.name_white:styles.name_black} >{chatContext.friend}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header:{
        top:0,
        position:'fixed',
        paddingLeft:8,
        paddingRight:10,
        flexDirection:'row',
        borderBottomWidth:.2,
        backgroundColor:'transparent',
        borderColor:'#3E3E3E',
        height:60,
        alignItems:'center',
        justifyContent:'left'
    },
    icon:{
        borderWidth:1,
        width:48,
        height:48,
        borderColor:'#00A3FC',
        borderRadius:50,
        marginLeft:5
    },
    name_white:{
        marginLeft:15,
        // fontSize:18,
        fontWeight:"700",
        color:'white'
    },
    name_black:{
        marginLeft:15,
        // fontSize:18,
        fontWeight:"700",
    },
    back:{
        height:25,
        width:25
    }
})

export default ContactInfo;
