import Rebase from 're-base';
import firebase  from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const app = firebase.initializeApp({
    apiKey: "AIzaSyB5m_ILM0slsAyc1VsNZhXZHpVv4_uXoqM",
    authDomain: "mywatchedseries.firebaseapp.com",
    databaseURL: "https://mywatchedseries.firebaseio.com",
    projectId: "mywatchedseries",
    storageBucket: "mywatchedseries.appspot.com",
    messagingSenderId: "184952930471",
    appId: "1:184952930471:web:4f2baf9dd0a94609c79b82"
  });

const db = app.database();
const base = Rebase.createClass(db);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth(app);
export default base;
