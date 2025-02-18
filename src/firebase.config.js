import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB_Qi7s27KgmKn4RuzlCk-e57yocqzIN4E',
  authDomain: 'supermarket-assistant.firebaseapp.com',
  projectId: 'supermarket-assistant',
  storageBucket: 'supermarket-assistant.firebasestorage.app',
  messagingSenderId: '559564714377',
  appId: '1:559564714377:web:a741e929d6106da3a63158',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
