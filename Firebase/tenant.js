import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from './firebase';

export const DEFAULT_GYM_ID = import.meta.env.VITE_DEFAULT_GYM_ID || 'default-gym';

const gymIdCache = new Map();

export async function getCurrentGymId() {
  const uid = getAuth().currentUser?.uid;
  if (!uid) {
    throw new Error('A authenticated user is required to access tenant data');
  }

  if (!gymIdCache.has(uid)) {
    const request = (async () => {
      const profileSnapshot = await getDoc(doc(db, 'users', uid));
      const gymId = profileSnapshot.data()?.gymId;
      if (!profileSnapshot.exists() || !gymId) {
        throw new Error('The authenticated user has no gym assigned');
      }
      return gymId;
    })().catch((error) => {
      gymIdCache.delete(uid);
      throw error;
    });
    gymIdCache.set(uid, request);
  }

  return gymIdCache.get(uid);
}
