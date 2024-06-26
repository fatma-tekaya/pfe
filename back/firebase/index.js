const firebase = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://smart-watch-e7244-default-rtdb.firebaseio.com/"
});

const db = firebase.database();
const firestore = firebase.firestore();
module.exports = {db,firebase,firestore};

