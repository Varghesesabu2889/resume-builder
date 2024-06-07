import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { useQuery } from 'react-query';

const useTemplate = () => {
  const getTemplates = async () => {
    const querySnapshot = await getDocs(query(collection(db, "templates"), orderBy("timeStamp", "desc")));
    return querySnapshot.docs.map((doc) => doc.data());
  };

  return useQuery(["templates"], () => getTemplates());
};

export default useTemplate;
