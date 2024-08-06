import React, {useContext, useState} from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import ContactCard from './ContactCard';
import { userContext } from '../../Contexts/UserContext';
import ChatBox from '../ChatBox/Message';

const Contacts = () => {
    const context = useContext(userContext);
    return (
        <ScrollView style={{flex:1}} >
            {
                context.friends.map((obj)=>{

                    return <>
                    <ContactCard obj={obj}/>
                    </>
                })
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({})

export default Contacts;
