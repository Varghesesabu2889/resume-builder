// Firebase API functions
import { arrayRemove, collection, doc, onSnapshot, orderBy, query, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase.config";
import { arrayUnion } from "firebase/firestore/lite";
import { toast } from "react-toastify";

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

export const getTemplates = () => {
  return new Promise((resolve, reject) => {
    const templateQuery = query(
      collection(db, "templates"),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(templateQuery, (querySnap) => {
      const templates = querySnap.docs.map((doc) => doc.data());
      resolve(templates);
    });
    return () => unsubscribe;
  });
};



// Function to add or remove an item from user's collection
export const toggleCollectionItem = async (user, data) => {
  const docRef = doc(db, 'users', user?.uid);
  let message = '';

  try {
    if (user?.collections?.includes(data?._id)) {
      await updateDoc(docRef, {
        collections: arrayRemove(data?._id),
      });
      message = 'Removed from Collection';
    } else {
      await updateDoc(docRef, {
        collections: arrayUnion(data?._id),
      });
      message = 'Added to Collection';
    }

    toast.success(message);
    // Perform any additional actions after updating collection
  } catch (err) {
    toast.error(`Error: ${err.message}`);
  }
};