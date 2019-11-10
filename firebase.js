
import * as firebase from "firebase";

const config = {
    apiKey: "AIzaSyDlS_1q4nmlnJAy8-HQvB6v9G1b0creXmk",
    authDomain: "certificates-dapp.firebaseapp.com",
    databaseURL: "https://certificates-dapp.firebaseio.com",
    projectId: "certificates-dapp",
    storageBucket: "certificates-dapp.appspot.com",
    messagingSenderId: "1023046526288",
    appId: "1:1023046526288:web:d3fc0339fd63096e"
};

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();

