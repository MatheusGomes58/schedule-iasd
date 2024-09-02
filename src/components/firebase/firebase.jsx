import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Configuração do Firebase
const firebaseConfig1 = {
  apiKey: "AIzaSyCTKMVCS-bq6ATJq76NfPML5QWR-6aUh2A",
  authDomain: "mmschedule-431da.firebaseapp.com",
  projectId: "mmschedule-431da",
  storageBucket: "mmschedule-431da.appspot.com",
  messagingSenderId: "1046379446876",
  appId: "1:1046379446876:web:89777debf84fae6c055c99",
  measurementId: "G-L16XNRX91L"
};

// Inicializa o aplicativo Firebase
const app = firebase.initializeApp(firebaseConfig1, 'app1');

// Inicializa o Firestore e Auth
const db = app.firestore();
const auth = app.auth();

// Exporta o Firestore, Auth e App
export { db, auth, app };
