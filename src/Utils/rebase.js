import Rebase from 're-base';
import firebase  from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const app = firebase.initializeApp({
    apiKey: "AIzaSyD9YYPJ9ONghtB39-ukUrbFzSs3HWYuW6Q",
    authDomain: "mywhatchedseries.firebaseapp.com",
    databaseURL: "https://mywhatchedseries.firebaseio.com",
    projectId: "mywhatchedseries"
});

const db = app.database();
const base = Rebase.createClass(db);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default base;
