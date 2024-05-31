import {getApp,getApps,initializeApp} from "firebase/app"
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAuWR0qCv6qextm9lzXXl3BF4nscLXEhcw",
    authDomain: "resumebooster-87ecf.firebaseapp.com",
    projectId: "resumebooster-87ecf",
    storageBucket: "resumebooster-87ecf.appspot.com",
    messagingSenderId: "232286275263",
    appId: "1:232286275263:web:687eabd3bbc88eaea2680a"
  };

 const app = getApps.length > 0 ? getApp(): initializeApp(firebaseConfig)
 const auth = getAuth(app)
 const db = getFirestore(app)

 export {auth,db};