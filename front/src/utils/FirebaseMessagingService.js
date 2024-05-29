import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../config';

// Request user permission for notifications
export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
    }
}

// Get the device token
export async function getToken(email) {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);

    // Envoyer le token au serveur
    await saveTokenToServer(token, email);

    return token;
}
// Fonction pour enregistrer le token sur le serveur
export const saveTokenToServer = async (token, email) => {
    try {
        await axios.post(`${BASE_URL}/save-token`, {
            token,
            email,
        });
        console.log('Token enregistré avec succès sur le serveur');
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du token sur le serveur', error);
    }
};



