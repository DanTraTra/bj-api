// postData.js
import { db, ref, set } from './firebase';

const postData = async (path, data) => {
  try {
    await set(ref(db, path), data);
    console.log('Data posted successfully!');
  } catch (error) {
    console.error('Error posting data:', error);
  }
};

export default postData;

// Usage
const userData = {
  username: 'JohnDoe',
  game_log_data: 'Some game log data'
};

postData('/userscores/user1', userData);
