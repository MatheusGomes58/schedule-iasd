import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

/*const firebaseConfig1 = {
  apiKey: "AIzaSyCO3dicnFgkU9fWbMIs_XIVOv-jMpVeEjE",
  authDomain: "agenda-barao.firebaseapp.com",
  projectId: "agenda-barao",
  storageBucket: "agenda-barao.appspot.com",
  messagingSenderId: "219773549070",
  appId: "1:219773549070:web:0788958515296f9c329a5f",
  measurementId: "G-3653N9M2VJ"
};*/

const firebaseConfig1 = {
  apiKey: "AIzaSyD71aajbuopH-VZ9gmo5poOFyp1Dhevw2s",
  authDomain: "agendaiasd-ccb49.firebaseapp.com",
  projectId: "agendaiasd-ccb49",
  storageBucket: "agendaiasd-ccb49.appspot.com",
  messagingSenderId: "372111701662",
  appId: "1:372111701662:web:8a5da0b08c1140779d6d8f",
  measurementId: "G-8YG9YKHNZ7"
};

const firebaseConfig2 = {
  apiKey: "AIzaSyAEEYZKzvkZsn7Jfql0gPjdmuRgmqOCX3Y",
  authDomain: "systemiasd.firebaseapp.com",
  databaseURL: "https://systemiasd-default-rtdb.firebaseio.com",
  projectId: "systemiasd",
  storageBucket: "systemiasd.appspot.com",
  messagingSenderId: "1024933571418",
  appId: "1:1024933571418:web:abc3e9e106b8385966a163"
};

const app = firebase.initializeApp(firebaseConfig1, 'app1');
const db = app.firestore();

const app2 = firebase.initializeApp(firebaseConfig2, 'app2');
const db2 = app2.firestore();

export { db, db2, app, app2 };