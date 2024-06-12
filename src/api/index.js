import { arrayRemove, arrayUnion, collection, doc, onSnapshot, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase.config';
import { toast } from 'react-toastify';

export const getUserDetail = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((userCred) => {
      if (userCred) {
        const userData = userCred.providerData[0];

        const unsubscribeSnapshot = onSnapshot(
          doc(db, 'users', userData?.uid),
          (_doc) => {
            if (_doc.exists()) {
              resolve(_doc.data());
            } else {
              setDoc(doc(db, 'users', userData?.uid), userData).then(() => {
                resolve(userData);
              });
            }
          }
        );

        return () => unsubscribeSnapshot();
      } else {
        reject(new Error('User is not authenticated'));
      }
    });

    return () => unsubscribe();
  });
};

export const getTemplates = () => {
  return new Promise((resolve, reject) => {
    const templateQuery = query(
      collection(db, 'templates'),
      orderBy('timestamp', 'asc')
    );
    const unsubscribe = onSnapshot(templateQuery, (querySnap) => {
      const templates = querySnap.docs.map((doc) => doc.data());
      resolve(templates);
    });
    return () => unsubscribe();
  });
};

export const saveToCollections = async (user, data) => {
  if (!user?.collections?.includes(data?._id)) {
    const docRef = doc(db, 'users', user?.uid);
      await updateDoc(docRef, {
        collections: arrayUnion(data?._id),
      });
      toast.success('Saved To Collections');
  } else {
    const docRef = doc(db, 'users', user?.uid);

      await updateDoc(docRef, {
        collections: arrayRemove(data?._id),
      });
      toast.success('Removed From Collections');
  }
};

export const saveToFavorites = async (user, data) => {
  if (!data?.favorites?.includes(user?.uid)) {
    const docRef = doc(db, 'templates', data?._id);
 
    await updateDoc(docRef, {
      favorites: arrayUnion(user?.uid),
      });
      toast.success('Added To Favorites');
  } else {
    const docRef =doc(db, 'templates', data?._id);

      await updateDoc(docRef, {
        favorites: arrayRemove(user?.uid),
      });
      toast.success('Removed From Favorites');
  }
};

export const getTemplateDetails = async(templateID)=>{
return new Promise((resolve,reject)=>{
  const unsubscribe = onSnapshot(doc(db,"templates",templateID),
(doc)=>{resolve(doc.data())

})
return unsubscribe

})

}

export const getTemplateDetailEditByUser = (uid, id) => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(
      doc(db, "users", uid, "resumes", id),
      (doc) => {
        resolve(doc.data());
      }
    );

    return unsubscribe;
  });
};
