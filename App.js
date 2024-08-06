import { View, Text, StyleSheet, StatusBar,Platform, SafeAreaView } from "react-native";
import Authenticate from "./Screens/Authenticate";
import { useState, useEffect} from "react";
import { userContext } from "./Contexts/UserContext";
import HomeScreen from "./Screens/HomeScreen";
import {socket} from "./socket";


export default function App() {
  const [user,setUser] = useState('satidiwas@gmail.com');
  const [changeMode, setChangeMode] = useState(false);
  const [clicked,setClicked] = useState(false);
  const [clickedId, setClickedId] = useState("");
  const [friends,setFriends] = useState([]);


  useEffect(()=>{
    if(user!=''){
      socket.connect('https://privatechats-backend1.onrender.com');
      socket.on('connect', ()=>{ socket.emit('secretID',user); });
    }
  },[user])





    useEffect(()=>{
      
      
      
      socket.on('connect_error',(err)=>console.log(err.message));
      

        
    },[])
  return (
    <SafeAreaView style={[!changeMode?styles.safe_view_light:styles.safe_view_dark]} >
      <StatusBar barStyle={changeMode?'light-content':'dark-content'} backgroundColor={changeMode?'black':'white'} />
      
      <userContext.Provider value={{user,setUser,changeMode,setChangeMode,clicked,setClicked,clickedId,setClickedId,friends,setFriends}}>
        {user?<HomeScreen />:<Authenticate />}
      </userContext.Provider>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  safe_view_dark:{
    flex:1,
    backgroundColor:'black'    
  },
  safe_view_light:{
    flex:1,
    backgroundColor:'white',   
  }
  }
)
