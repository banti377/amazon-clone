import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDKbhLjiyIMjpVFrhjAR87Yki8I2bJRsTs',
  authDomain: 'clone-44fd6.firebaseapp.com',
  projectId: 'clone-44fd6',
  storageBucket: 'clone-44fd6.appspot.com',
  messagingSenderId: '352350603107',
  appId: '1:352350603107:web:7cb2339b7e21b7dfd03556',
};

firebase.initializeApp(firebaseConfig);

export default firebase;
