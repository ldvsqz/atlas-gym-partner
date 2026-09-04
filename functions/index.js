import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { onInit } from 'firebase-functions/v2/core';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { randomBytes } from 'node:crypto';

let db;
let auth;

onInit(() => {
  initializeApp();
  db = getFirestore();
  auth = getAuth();
});

async function requireProfile(uid) {
  const snapshot = await db.collection('users').doc(uid).get();
  if (!snapshot.exists) {
    throw new HttpsError('not-found', 'El perfil del miembro no existe.');
  }
  return snapshot.data();
}

async function requireSuperAdmin(uid) {
  const profile = await requireProfile(uid);
  if (profile.rol !== 2) {
    throw new HttpsError('permission-denied', 'Solo un super administrador puede crear cuentas.');
  }
}

async function requireAdmin(uid) {
  const profile = await requireProfile(uid);
  if (profile.rol !== 0 && profile.rol !== 2) {
    throw new HttpsError('permission-denied', 'Solo un administrador puede crear cuentas.');
  }
  return profile;
}

function createTemporaryPassword() {
  return `At-${randomBytes(9).toString('base64url')}!`;
}

async function getPasswordAuthStatus(uid) {
  try {
    const record = await auth.getUser(uid);
    return {
      hasAccount: true,
      hasEmailPassword: record.providerData.some((provider) => provider.providerId === 'password'),
    };
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return { hasAccount: false, hasEmailPassword: false };
    }
    throw error;
  }
}

export const getMemberAuthStatus = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Debe iniciar sesión.');
  }

  const uid = String(request.data?.uid || '');
  if (!uid) {
    throw new HttpsError('invalid-argument', 'Se requiere el UID del miembro.');
  }

  if (request.auth.uid !== uid) {
    await requireSuperAdmin(request.auth.uid);
  }

  return getPasswordAuthStatus(uid);
});

export const createMemberEmailPasswordAccount = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Debe iniciar sesión.');
  }
  await requireSuperAdmin(request.auth.uid);

  const uid = String(request.data?.uid || '');
  const temporaryPassword = String(request.data?.temporaryPassword || '');
  if (!uid || temporaryPassword.length < 6) {
    throw new HttpsError('invalid-argument', 'La contraseña temporal debe tener al menos 6 caracteres.');
  }

  const profile = await requireProfile(uid);
  const email = String(profile.email || '').trim().toLowerCase();
  if (!email) {
    throw new HttpsError('failed-precondition', 'El miembro no tiene un correo registrado.');
  }

  const currentStatus = await getPasswordAuthStatus(uid);
  if (currentStatus.hasAccount) {
    throw new HttpsError('already-exists', 'El miembro ya tiene una cuenta de autenticación.');
  }

  try {
    const existingByEmail = await auth.getUserByEmail(email);
    throw new HttpsError('already-exists', `El correo ya está asociado a otra cuenta (${existingByEmail.uid}).`);
  } catch (error) {
    if (error.code !== 'auth/user-not-found') throw error;
  }

  await auth.createUser({ uid, email, password: temporaryPassword, emailVerified: false });
  return { hasAccount: true, hasEmailPassword: true };
});

export const createMemberWithTemporaryAccount = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Debe iniciar sesión.');
  const adminProfile = await requireAdmin(request.auth.uid);
  const input = request.data || {};
  const email = String(input.email || '').trim().toLowerCase();
  const name = String(input.name || '').trim();
  const gymId = String(input.gymId || '').trim();
  if (!name || !email || !gymId) {
    throw new HttpsError('invalid-argument', 'Nombre, correo y gimnasio son obligatorios.');
  }
  if (adminProfile.rol !== 2 && adminProfile.gymId !== gymId) {
    throw new HttpsError('permission-denied', 'No puede crear miembros para otro gimnasio.');
  }

  try {
    await auth.getUserByEmail(email);
    throw new HttpsError('already-exists', 'El correo ya tiene una cuenta de acceso.');
  } catch (error) {
    if (error.code !== 'auth/user-not-found') throw error;
  }

  const temporaryPassword = createTemporaryPassword();
  const record = await auth.createUser({ email, password: temporaryPassword, emailVerified: false });
  try {
    await db.collection('users').doc(record.uid).set({
      uid: record.uid,
      name,
      email,
      dni: String(input.dni || '').trim(),
      phone: String(input.phone || '').trim(),
      birthday: input.birthday ? new Date(input.birthday) : new Date(),
      until: new Date(),
      gymId,
      rol: 1,
      createdAt: new Date(),
    });
  } catch (error) {
    await auth.deleteUser(record.uid);
    throw error;
  }

  return { uid: record.uid, email, temporaryPassword };
});

export const provisionExistingMemberAccounts = onCall({ timeoutSeconds: 540 }, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Debe iniciar sesión.');
  await requireSuperAdmin(request.auth.uid);

  const users = await db.collection('users').get();
  const created = [];
  const skipped = [];

  for (const snapshot of users.docs) {
    const profile = snapshot.data();
    const uid = snapshot.id;
    const email = String(profile.email || '').trim().toLowerCase();
    if (!email) {
      skipped.push({ uid, email: '', reason: 'Sin correo registrado' });
      continue;
    }

    const status = await getPasswordAuthStatus(uid);
    if (status.hasAccount) {
      skipped.push({ uid, email, reason: 'Ya tiene cuenta de autenticación' });
      continue;
    }

    try {
      await auth.getUserByEmail(email);
      skipped.push({ uid, email, reason: 'Correo asociado a otra cuenta' });
      continue;
    } catch (error) {
      if (error.code !== 'auth/user-not-found') throw error;
    }

    const temporaryPassword = createTemporaryPassword();
    await auth.createUser({ uid, email, password: temporaryPassword, emailVerified: false });
    created.push({ uid, email, temporaryPassword });
  }

  return { created, skipped };
});
