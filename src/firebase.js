import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set } from 'firebase/database'
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  setPersistence, 
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyBBdDBWIvqGjthSNJroGe1BmJHzqYUw-Vw",
  authDomain: "moodmate-39b26.firebaseapp.com",
  databaseURL: "https://moodmate-39b26-default-rtdb.firebaseio.com",
  projectId: "moodmate-39b26",
  storageBucket: "moodmate-39b26.firebasestorage.app",
  messagingSenderId: "467577595466",
  appId: "1:467577595466:web:55419212694e7bc076e8b3",
  measurementId: "G-00V4X59CLS"
};


const app = initializeApp(firebaseConfig)


try {
  getAnalytics(app);
} catch (error) {
  console.error('Analytics initialization error:', error);
}


const auth = getAuth(app)
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error('Auth persistence error:', error)
  })

const db = getDatabase(app)
const provider = new GoogleAuthProvider()


provider.addScope('https://www.googleapis.com/auth/userinfo.email')
provider.addScope('https://www.googleapis.com/auth/userinfo.profile')

export const signInWithGoogle = async () => {
  try {
    
    await signOut(auth)
    
    const result = await signInWithPopup(auth, provider)
    console.log('Sign in successful:', result.user)
    return result.user
  } catch (error) {
    console.error('Detailed Auth Error:', {
      code: error.code,
      message: error.message,
      email: error.email,
      credential: error.credential
    })
    
    let errorMessage = 'Failed to sign in. Please try again.'
    if (error.code === 'auth/configuration-not-found') {
      errorMessage = 'Authentication configuration error. Please contact support.'
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Please enable popups for this website'
    } else if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in was cancelled. Please try again.'
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your internet connection.'
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMessage = 'This domain is not authorized for authentication.'
    }
    
    throw new Error(errorMessage)
  }
}

export const signUpWithEmail = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(userCredential.user, { displayName })
    return userCredential.user
  } catch (error) {
    let errorMessage = 'Failed to sign up. Please try again.'
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already registered. Please try signing in instead.'
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password should be at least 6 characters long.'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Please enter a valid email address.'
    }
    throw new Error(errorMessage)
  }
}

export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  } catch (error) {
    let errorMessage = 'Failed to sign in. Please try again.'
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      errorMessage = 'Invalid email or password.'
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed attempts. Please try again later.'
    }
    throw new Error(errorMessage)
  }
}

export const signOutUser = () => signOut(auth)

export const addMoodEntryToDB = (entry) => {
  if (!auth.currentUser) return Promise.reject('No user signed in')
  const moodRef = ref(db, `moods/${auth.currentUser.uid}/${entry.date}`)
  return set(moodRef, entry)
}

export { auth, db }
