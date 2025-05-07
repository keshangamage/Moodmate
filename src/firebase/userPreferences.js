import { ref, set, get } from 'firebase/database';
import { db as database } from '../firebase';

export const saveUserPreferences = async (userId, preferences) => {
  try {
    const userPrefsRef = ref(database, `users/${userId}/preferences`);
    await set(userPrefsRef, preferences);
    return true;
  } catch (error) {
    console.error('Error saving preferences:', error);
    throw error;
  }
};

export const getUserPreferences = async (userId) => {
  try {
    const userPrefsRef = ref(database, `users/${userId}/preferences`);
    const snapshot = await get(userPrefsRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Error getting preferences:', error);
    throw error;
  }
};