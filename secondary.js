import * as firebase from "firebase";

const config = {
    apiKey: "xxxxx",
    authDomain: "certificates-dapp.firebaseapp.com",
    databaseURL: "https://certificates-dapp.firebaseio.com",
    projectId: "certificates-dapp",
    storageBucket: "certificates-dapp.appspot.com",
    messagingSenderId: "1023046526288",
    appId: "1:1023046526288:web:d3fc0339fd63096e"
};

export default (firebase.apps.length!=2) ? firebase.initializeApp(config, "Secondary") : firebase.app("Secondary");
