import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';

const rulesPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../firestore.rules');
const projectId = 'atlas-gym-partner-rules-test';

let testEnv;

const adminProfile = {
  uid: 'admin-user',
  rol: 0,
  name: 'Admin',
  email: 'admin@example.com',
  dni: '111111111',
  phone: '88888888',
};

const memberProfile = {
  uid: 'member-user',
  rol: 1,
  name: 'Member',
  email: 'member@example.com',
  dni: '222222222',
  phone: '77777777',
  until: new Date('2026-12-31'),
};

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules: fs.readFileSync(rulesPath, 'utf8'),
    },
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, 'users/admin-user'), adminProfile);
    await setDoc(doc(db, 'users/member-user'), memberProfile);
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe('users collection rules', () => {
  it('allows admins to read any user profile', async () => {
    const db = testEnv.authenticatedContext('admin-user').firestore();
    await assertSucceeds(getDoc(doc(db, 'users/member-user')));
  });

  it('allows members to read their own profile', async () => {
    const db = testEnv.authenticatedContext('member-user').firestore();
    await assertSucceeds(getDoc(doc(db, 'users/member-user')));
  });

  it('blocks members from reading other profiles', async () => {
    const db = testEnv.authenticatedContext('member-user').firestore();
    await assertFails(getDoc(doc(db, 'users/admin-user')));
  });

  it('allows members to update only safe profile fields', async () => {
    const db = testEnv.authenticatedContext('member-user').firestore();
    await assertSucceeds(updateDoc(doc(db, 'users/member-user'), {
      name: 'Updated Member',
      phone: '66666666',
    }));
  });

  it('blocks members from updating membership or role fields', async () => {
    const db = testEnv.authenticatedContext('member-user').firestore();
    await assertFails(updateDoc(doc(db, 'users/member-user'), {
      until: new Date('2099-12-31'),
    }));
    await assertFails(updateDoc(doc(db, 'users/member-user'), {
      rol: 0,
    }));
  });
});

describe('default deny rule', () => {
  it('blocks access to unknown collections', async () => {
    const db = testEnv.authenticatedContext('admin-user').firestore();
    await assertFails(setDoc(doc(db, 'secrets/doc-1'), { value: true }));
  });
});
