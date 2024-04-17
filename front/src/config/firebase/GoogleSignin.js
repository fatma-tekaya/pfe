import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from  '@react-native-firebase/auth';
import axios from 'axios';

export const  signInWithGoogle = async () => {
    setIsLoading(true);
    try{
       
        GoogleSignin.configure({
            offlineAccess:false,
            webClientId:'972071422730-3ocqp31uq1i7guc6pqiri6u0f9gmi2u2.apps.googleusercontent.com',
            scopes:['profile','email']
        })
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
         console.log(userInfo);
         const { idToken } = userInfo;
         const googleCredentials =auth.GoogleAuthProvider.credential(userToken);
         auth().signInWithCredential(googleCredentials);
         const response = await axios.post(`${BASE_URL}/sign-in-google`, {
            idToken: idToken
        });

        // Handle the response from the backend (e.g., store JWT)
        const { token } = response.data;
         return userInfo;
    }catch(error){
        console.log(error)
    }
    setIsLoading(false);
}