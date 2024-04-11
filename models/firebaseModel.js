// models/firebaseModel.js
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyARQrBTmekSsmXuoo-evcEoTUbeaR7yM5o",
    authDomain: "rogue-lite.firebaseapp.com",
    databaseURL: "https://rogue-lite-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "rogue-lite",
    storageBucket: "rogue-lite.appspot.com",
    messagingSenderId: "1091853759584",
    appId: "1:1091853759584:web:6f811c7407ed000acd7f05",
    measurementId: "G-8D2P7DBQHP"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

module.exports = db;