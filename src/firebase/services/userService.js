import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function createUserDoc(uid, data) {
  const ref = doc(db, "users", uid);
  await setDoc(ref, {
    ...data,
    joinedAt: data.joinedAt || new Date(),
  }, { merge: true });
}

export async function getUserDoc(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function updateUserDoc(uid, data) {
  await updateDoc(doc(db, "users", uid), data);
}
