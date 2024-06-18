// getData.js
import { db, ref, get, child } from './firebase';

const getData = async (path) => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, path));
    if (snapshot.exists()) {
      console.log('Data retrieved successfully:', snapshot.val());
      return snapshot.val();
    } else {
      console.log('No data available');
      return null;
    }
  } catch (error) {
    console.error('Error getting data:', error);
  }
};

export default getData;

// Usage
getData('/').then((data) => {
  console.log(data);
});
