
import * as firebase from "firebase";

const config = {
    apiKey: "xxxx",
    authDomain: "xxx",
    databaseURL: "xxx",
    projectId: "certificates-dapp",
    storageBucket: "certificates-dapp.appspot.com",
    messagingSenderId: "xxx",
    appId: "xxx"
};

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();

