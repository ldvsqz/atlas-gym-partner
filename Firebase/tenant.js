import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from './firebase';

export const DEFAULT_GYM_ID = import.meta.env.VITE_DEFAULT_GYM_ID || 'default-gym';
export const SUPER_ADMIN_ROLE = 2;
export const GYM_ADMIN_ROLE = 0;
export const MEMBER_ROLE = 1;

const gymIdCache = new Map();

export async function getCurrentGymId() {
  const uid = getAuth().currentUser?.uid;
  if (!uid) {
    throw new Error('A authenticated user is required to access tenant data');
  }

  if (!gymIdCache.has(uid)) {
    const request = (async () => {
      const profileSnapshot = await getDoc(doc(db, 'users', uid));
      const profile = profileSnapshot.data() || {};
      const selectedGymId = typeof localStorage !== 'undefined'
        ? localStorage.getItem(`ACTIVE_GYM_ID:${uid}`)
        : null;
      const canAccessSelectedGym = profile.rol === 2
        || (profile.gymIds || [profile.gymId]).includes(selectedGymId);
      const gymId = selectedGymId && canAccessSelectedGym
        ? selectedGymId
        : profile.gymId || profile.gymIds?.[0];
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

export function setCurrentGymId(gymId) {
  const uid = getAuth().currentUser?.uid;
  if (!uid || !gymId) return;
  localStorage.setItem(`ACTIVE_GYM_ID:${uid}`, gymId);
  gymIdCache.delete(uid);
}
