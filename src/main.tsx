import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.scss'
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

  apiKey: "AIzaSyCkaHLR6xTBpL5Gw9YwAHOkgG7jURKVUvs",

  authDomain: "music-ead20.firebaseapp.com",

  projectId: "music-ead20",

  storageBucket: "music-ead20.appspot.com",

  messagingSenderId: "306375561002",

  appId: "1:306375561002:web:69fc2bcdd69f51fc995853",

  measurementId: "G-07K8CLZW4T"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore(app);



ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
)
