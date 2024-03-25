import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext ,useState ,useEffect} from 'react';
import { BASE_URL } from '../config';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const[isLoading , setIsLoading] = useState(false);
    const [userToken ,setUserToken] = useState(null);
    const [userInfo ,setUserInfo] = useState(null);


    const login = async (email , password)=>{
        setIsLoading(true);
        await axios.post(`${BASE_URL}/sign-in`,{
            email,
            password
        })
        .then(res=>{
            console.log(res.data);
            let userInfo = res.data;
            setUserInfo(userInfo);
            setUserToken(userInfo.token)
            console.log('User Token:' + userInfo.token);
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));  
        AsyncStorage.setItem('userToken', userInfo.token);
        }).catch(err=>console.error(err));
       
        setIsLoading(false);
    }
    const logout=()=>{
        setIsLoading(true);
        setUserToken(null);
        AsyncStorage.removeItem('userInfo');
        AsyncStorage.removeItem('userToken');
        setIsLoading(false);
    }

    const isLoggedIn = async ()=>{
      try {
        setIsLoading(true);
        let userInfo = await AsyncStorage.getItem('userInfo');
        let userToken = await AsyncStorage.getItem('userToken');
        userInfo=JSON.parse(userInfo);
        
        if (userInfo){
            setUserToken(userToken);
            setUserInfo(userInfo);
        }
        setIsLoading(false);
    } catch (error) {
        console.log(`isLogged in error ${error}`);
      }

    }
    useEffect(()=>{
        isLoggedIn();
    },[])

  return (
  <AuthContext.Provider value={{login , logout, isLoading,userToken , userInfo}} >
    {children}
    </AuthContext.Provider>
    );
};
