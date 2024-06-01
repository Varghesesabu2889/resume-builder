import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase.config";

export const getUserDetail = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((userCred) => {
      if (userCred) {
        const userData = userCred.providerData[0];
        
        const unsubscribeSnapshot = onSnapshot(
          doc(db, "users", userData?.uid),
          (_doc) => {
            if (_doc.exists()) {
              resolve(_doc.data());
            } else {
              setDoc(doc(db, "users", userData?.uid), userData).then(() => {
                resolve(userData);
              });
            }
          }
        );

        // Ensure we unsubscribe from the snapshot listener to prevent memory leaks
        return unsubscribeSnapshot;
      } else {
        reject(new Error("User is not authenticated"));
      }
    });

    // Ensure we unsubscribe from the auth listener to prevent memory leaks
    return () => unsubscribe();
  });
};
