import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Configuração do Firebase
const firebaseConfig1 = {
  apiKey: "AIzaSyDt-XqkxkS_hEkMWRpHPzc3RtTy-wSqYmE",
  authDomain: "agendaregiao5-fd149.firebaseapp.com",
  projectId: "agendaregiao5-fd149",
  storageBucket: "agendaregiao5-fd149.firebasestorage.app",
  messagingSenderId: "179407923159",
  appId: "1:179407923159:web:fa038d17434892579f4d92",
  measurementId: "G-Y595JM4YBS"
};

// Inicializa o aplicativo Firebase
const app = firebase.initializeApp(firebaseConfig1, 'app1');

// Inicializa o Firestore e Auth
const db = app.firestore();
const auth = app.auth();

// Exporta o Firestore, Auth e App
export { db, auth, app };
