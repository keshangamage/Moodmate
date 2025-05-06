import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push } from 'firebase/database'


const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "moodmate-app.firebaseapp.com",
  databaseURL: "https://moodmate-app-default-rtdb.firebaseio.com",
  projectId: "moodmate-app",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}


const app = initializeApp(firebaseConfig)


const db = getDatabase(app)


export const addMoodEntryToDB = (entry) => {
  const moodRef = ref(db, 'moods') 
  return push(moodRef, entry)
}
