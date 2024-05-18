import React,{useEffect} from 'react';
import { AuthProvider } from './src/context/AuthContext';
import AppNav from './src/navigation/AppNav';
import {requestUserPermission } from './src/utils/notificationServices';
function App() {
  
  useEffect(()=>{
    requestUserPermission()
  },[])
  return (

    <AuthProvider>
    <AppNav/>
    </AuthProvider>
   
  );
}

export default App;