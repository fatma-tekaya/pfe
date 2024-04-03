import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext ,useState ,useEffect} from 'react';
import { BASE_URL } from '../config';
import axios from 'axios';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import ConfirmationSentScreen from '../screens/ConfirmationSentScreen';


export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const[isLoading , setIsLoading] = useState(false);
    const [userToken ,setUserToken] = useState(null);
    const [userInfo ,setUserInfo] = useState(null);



    const signup = async (fullname, email, password, setIsLoading) => {
      setIsLoading(true);
      try {
        const response = await axios.post(`${BASE_URL}/create-user`, {
          fullname,
          email,
          password,
        });
    
        const userInfo = response.data;
        console.log(userInfo);
    
        if (userInfo.success) {
          console.log(userInfo.message);
          setIsLoading(false);
           
          // Assuming setUserInfo is a state setter function
        
          return userInfo; // Return success data (optional)
        } else {
          throw new Error(userInfo.message || 'Signup failed'); // Throw specific error
        }
      } catch (error) {
        console.error('Error signing up:', error);
        setIsLoading(false);
        throw error; // Re-throw for further handling
      }
    };
    

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


    const loginWithFacebook = async () => {
        setIsLoading(true);
        try {
          const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
          if (result.isCancelled) {
            console.log('Login with Facebook cancelled.');
          } else {
            const tokenData = await AccessToken.getCurrentAccessToken();
            if (!tokenData) {
              throw new Error('Failed to get access token for Facebook login.');
            }
            const accessToken = tokenData.accessToken.toString();
            const response = await fetch('https://graph.facebook.com/me?fields=id,name,email&access_token=' + accessToken);
    
            const userInfo = await response.json();
            setUserInfo(userInfo);
            setUserToken(accessToken)
    
            await fetch(`${BASE_URL}/facebookAuth`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  id: userInfo.id,
                  fullname: userInfo.name,
                  email: userInfo.email, 
                  accessToken: accessToken,
                }),
              });
            console.log('Access token for Facebook login:', accessToken);
           
          }
        } catch (error) {
          console.error('Error during Facebook login:', error);
        }
        setIsLoading(false);
      };
    


    const logout=async()=>{
        setIsLoading(true);
        //await axios.post(`${BASE_URL}/sign-out`);
        setUserToken(null);
        AsyncStorage.removeItem('userInfo');
        AsyncStorage.removeItem('userToken');
        console.log('loggged out successfully')
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
  <AuthContext.Provider value={{login , logout,loginWithFacebook,signup, isLoading,userToken ,setIsLoading, userInfo}} >
    {children}
    </AuthContext.Provider>
    );
};