import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function clearTeachers() {
  const snapshot = await getDocs(collection(db, 'teachers'));
  for (const docSnap of snapshot.docs) {
    await deleteDoc(doc(db, 'teachers', docSnap.id));
  }
  console.log('Cleared teachers');
}

clearTeachers();
