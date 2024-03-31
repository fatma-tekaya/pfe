import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from  '@react-native-firebase/auth';


export const  signInWithGoogle = async () => {

    try{
        GoogleSignin.configure({
            offlineAccess:false,
            webClientId:'972071422730-3ocqp31uq1i7guc6pqiri6u0f9gmi2u2.apps.googleusercontent.com',
            scopes:['profile','email']
        })
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
         console.log(userInfo);
         const {userToken}= await GoogleSignin.signIn();
         const googleCredentials =auth.GoogleAuthProvider.credential(userToken);
         auth().signInWithCredential(googleCredentials);
         return userInfo;
    }catch(error){
        console.log(error)
    }
}