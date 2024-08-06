import React, { useContext, useEffect, useState } from 'react';
import Header from '../Components/Home/Header';
import Contacts from '../Components/Home/Contacts';
import { StyleSheet, View } from 'react-native';
import { userContext } from '../Contexts/UserContext';
import ChatBox from '../Screens/ChatBox';

const HomeScreen = () => {
    const context = useContext(userContext);
    useEffect(()=>{
        fetch('https://privatechats-backend1.onrender.com/fetchFriends',{
            method:'POST',
            body:JSON.stringify({
              user:context.user
            }),
            headers:{
              "Content-Type":"application/json"
            }
          }).then((res)=>res.json().then((data)=>{
            context.setFriends(data);
            // console.log(context.friends);
          }).catch((err)=>{
            console.log("data nahi mila");
          })).catch((err)=>{
            console.log('kuch to gadbad h daya');
          })
    },[])
    return (
        <>
          <View style={{flex:1}}>
              <Header/>
              <Contacts/>  
          </View>
          {context.friends.map((obj)=>{
            return <ChatBox obj = {obj}/>
          })}
        </>
    );
}

const styles = StyleSheet.create({})

export default HomeScreen;
