import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyB1N8Y_LZw8m-N2ugnrVXWLLw2vVPqgfzE",
    authDomain: "vuex-jokes-app.firebaseapp.com",
    projectId: "vuex-jokes-app",
    storageBucket: "vuex-jokes-app.appspot.com",
    messagingSenderId: "551259326396",
    appId: "1:551259326396:web:badab2fc5c9b2c23a30db9"
  };

if(!firebase.apps.length) //instead of creating mutiple instances, 
                          //and assigning the firebase, need to just create once.
{
    firebase.initializeApp(firebaseConfig);
}

export const fstore = firebase.firestore(); //instialize only once, and call it when required.
export const auth = firebase.auth();   //instead of calling .auth() for every operation