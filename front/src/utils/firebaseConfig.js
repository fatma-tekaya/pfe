import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp();
}

const database = firebase.database();

export default database;
