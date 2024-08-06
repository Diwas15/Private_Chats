import React, { useState,useRef, useEffect, useContext } from 'react';
import logo from '../assets/images/logo.png';
import { StyleSheet, View, Text ,TextInput, Image, Pressable, TouchableWithoutFeedback, Keyboard } from 'react-native';
import slide from '../assets/images/slide.png';
import not from '../assets/images/not.png'
import valid from '../assets/images/valid.png'
import { userContext } from '../Contexts/UserContext';
import { socket } from '../socket';


const Authenticate = () => {
    const context = useContext(userContext);
    const [front, setFront] = useState(true);
    const [code1,setCode1] = useState('');
    const [code2,setCode2] = useState('');
    const [code3,setCode3] = useState('');
    const [code4,setCode4] = useState('');
    const t1 = useRef();
    const t2 = useRef();
    const t3 = useRef();
    const t4 = useRef();
    const [mailValid, setMailValid] = useState(null)
    const [email,setEmail] = useState("");

    useEffect(()=>{
        if(front==false)
                t1.current.focus();
    },[front])

    function handleVerify(){
        let code = code1+code2+code3+code4;
        if(code.length<4)   window.alert("OTP NOT COMPLETE");
        else{
            fetch('https://privatechats-backend1.onrender.com/verify',{
                method:'POST',
                body:JSON.stringify({user:email,code:code}),
                headers:{
                "Content-Type":"application/json"
                }
                
            }).then((res)=>res.json().then((data)=>{
                // console.log(data.token);
                context.setUser(email);
            })).catch((err)=>console.log(err));
        }
    }
    
    function getOTP(){
        //console.log(email);
        fetch('https://privatechats-backend1.onrender.com/generate',{
            method:'POST',
            body:JSON.stringify({email:email}),
            headers:{
                "Content-Type":"application/json"
            }
        }).then((res)=>{
            setFront(false);
        }).catch((err)=>console.log(err));
    }

   


    return (
        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>

            <View style={styles.auth_container} >
                <Image source={logo} style={styles.logo} />
                {front && <View style={{alignItems:'center',}}>
                    <TextInput style={styles.username} placeholder='Email' placeholderTextColor={'gray'} onChangeText={(text)=>{
                        setEmail(text);
                    }}/>
                    <Image  style={mailValid==false?styles.punctuators:{display:'none'}} source={not}/>
                    <Image  style={mailValid==true?styles.punctuators:{display:'none'}} source={valid}/>
                    <Pressable  style={styles.otp_btn} onPress={getOTP} ><Text style={styles.btn_txt}>Get OTP</Text></Pressable>
                </View>}
                {!front &&
                    <>
                    <Pressable onPress={()=>{
                        setCode1('');setCode2('');setCode3('');setCode4('');
                        setFront(true);
                    }} ><Image style={styles.slide} source={slide}/></Pressable>
                    <View style={styles.otp_container} >
                        <TextInput inputMode='numeric' ref={t1} maxLength={1} value={code1} style={styles.otp_input} onKeyPress={(e)=>{
                            if(e.nativeEvent.key=="Backspace")
                                setCode4('');
                        }} 
                        
                        onChangeText={(text)=>{
                            setCode1(text);
                            if(text!='') t2.current.focus();

                        }} ></TextInput>
                        <TextInput inputMode='numeric' ref={t2} maxLength={1} value={code2} style={styles.otp_input} onKeyPress={(e)=>{
                            if(e.nativeEvent.key=="Backspace"){
                                setCode2('');
                                t1.current.focus();
                            }
                        }} 
                        
                        onChangeText={(text)=>{
                            setCode2(text);
                            if(text!='') t3.current.focus();

                        }} ></TextInput>
                        <TextInput inputMode='numeric' ref={t3} maxLength={1} value={code3} style={styles.otp_input} onKeyPress={(e)=>{
                            if(e.nativeEvent.key=="Backspace"){
                                setCode3('');
                                t2.current.focus();
                            }
                        }} 
                        
                        onChangeText={(text)=>{
                            setCode3(text);
                            if(text!='') t4.current.focus();

                        }} ></TextInput>
                        <TextInput inputMode='numeric' ref={t4} maxLength={1} value={code4} style={styles.otp_input} onKeyPress={(e)=>{
                            if(e.nativeEvent.key=="Backspace"){
                                setCode4('');
                                t3.current.focus();
                            }
                        }} 
                        
                        onChangeText={(text)=>{
                            setCode4(text);

                        }} ></TextInput>
                    </View>
                    <Pressable style={styles.otp_btn} onPress={handleVerify}>
                        <Text style={styles.btn_txt} >Verify</Text>
                    </Pressable> 

                    </>}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    auth_container:{
        // borderWidth:1,
        // borderColor:'red',
        flex:1,
        alignItems:'center',
        justifyContent:'top',
        paddingTop:100,
    },
    username:{
        width:350 ,
        borderBottomWidth:1,
        borderColor:'gray',
        color:'gray',
        // fontSize:25,
        marginBottom:30
    },
    logo:{
        height:150,
        width:150,
        marginBottom:30
    },
    otp_btn:{
        backgroundColor:'#00A3FC',
        height:50,
        width:100,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10
    },
    btn_txt:{
        color:'white',
        // fontSize:20,
    },
    otp_input:{
        borderWidth:1,
        borderRadius:5,
        height:45,
        width:45,
        margin:10,
        borderColor:'#00A3FC',
        shadowColor:'#00A3FC',
        shadowOffset:-20,
        shadowRadius:5,
        shadowOpacity:.5,
        textAlign:'center',
        // fontSize:20,
        color:'gray'
    },
    otp_container:{
        display:'flex',
        flexDirection:'row',
        marginBottom:30,
    },
    slide:{
        height:25,
        width:25,
        transform:[
            {rotateZ:'180deg'}
        ],
        left:-180,
        top:-270
    },
    punctuators:{
        position:'absolute',
        height:35,
        width:35,
        top:-5,
        right:-5
    }
})

export default Authenticate;
