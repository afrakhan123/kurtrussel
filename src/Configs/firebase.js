
import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database"
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
    apiKey: "AIzaSyBCg3XMuou-R6JepSugEezDKXCxLgVlk2o",
    authDomain: "utak-assessment.firebaseapp.com",
    databaseURL: "https://utak-assessment-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "utak-assessment",
    storageBucket: "utak-assessment.appspot.com",
    messagingSenderId: "907350713322",
    appId: "1:907350713322:web:491b89eabb3781a1b7c893",
    measurementId: "G-0GL54FQTBM"
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getDatabase(app);