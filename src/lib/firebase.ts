// src/firebase/config.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB_FdEQydzh64Lo7-6FqxplC7W-cKPGpfA',
  authDomain: 'prv-fund.firebaseapp.com',
  projectId: 'prv-fund',
  storageBucket: 'prv-fund.firebasestorage.app',
  messagingSenderId: '531196935280',
  appId: '1:531196935280:web:84f950d95fa39f87ca08b5'
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

// Exportar autenticação e firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
