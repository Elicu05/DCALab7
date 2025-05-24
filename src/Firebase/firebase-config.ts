import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
  } from "firebase/auth";

  const firebaseConfig = {
    apiKey: "AIzaSyBLWTVhaOG1_ZeHdOlkMFRTLctsZimphxU",
    authDomain: "tasks-app-eli.firebaseapp.com",
    projectId: "tasks-app-eli",
    storageBucket: "tasks-app-eli.firebasestorage.app",
    messagingSenderId: "12195379817",
    appId: "1:12195379817:web:d347ad6ab379fa3acf80f8",
    measurementId: "G-23TG88V1Q9"
  };
  
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 
const auth = getAuth(app);

const registerUser = async (email: string, password: string) => {
	try {
    console.log("Registering user with email:", email);
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		console.log(userCredential.user);
		return { isRegistered: true, user: userCredential };
	} catch (error) {
		console.error(error);
		return { isRegistered: false, error: error };
	}
};

const loginUser = async (email: string, password: string) => {
  try {
    console.log("Logging in user with email:", email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log(userCredential.user);
    return { isLoggedIn: true, user: userCredential };
  } catch (error) {
    console.error(error);
    return { isLoggedIn: false, error: error };
  }
}

export { app, db, auth, registerUser, loginUser};