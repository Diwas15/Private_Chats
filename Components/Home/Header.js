import React,{useContext, useState} from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Pressable } from 'react-native';
import logo from '../../assets/images/logo.png';
import logout from '../../assets/images/logout.png';
import { userContext } from '../../Contexts/UserContext';
const Header = () => {
    const context = useContext(userContext);
    return (
        <View style={[styles.header,context.clicked?[{display:'none'}]:'']}>
            <Image source={logo} style={styles.logo}/>
            <TouchableOpacity activeOpacity={1} onPress={()=>context.setChangeMode(!context.changeMode)}>
                <View style={styles.theme_btn}>
                    <View style={context.changeMode?styles.dark:styles.light}>

                    </View>
                </View>
            </TouchableOpacity>
            <Pressable onPress={()=>{
                
                context.setUser('')
            }}><Image source={logout} style={styles.logout}/></Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    header:{
        top:0,
        position:'relative',
        paddingLeft:8,
        paddingRight:10,
        flexDirection:'row',
        borderBottomWidth:.2,
        backgroundColor:'transparent',
        borderColor:'#3E3E3E',
        height:60,
        alignItems:'center',
        justifyContent:'space-between'
    },
    logo:{
        height:60,
        width:60
    },
    theme_btn:{
        borderWidth:1,
        borderColor:'#00A3FC',
        borderRadius:50,
        height:33,
        width:53,
        justifyContent:'center',
    },
    light:{
        position:'absolute',
        width:25,
        height:25,
        borderRadius:50,
        marginLeft:1,
        marginRight:1,
        backgroundColor:'#00A3FC'
    },
    dark:{
        position:'absolute',
        right:0,
        width:25,
        height:25,
        borderRadius:50,
        marginLeft:1,
        marginRight:1,
        backgroundColor:'#00A3FC'
    },
    logout:{
        width:30,
        height:30,
    }
})

export default Header;
