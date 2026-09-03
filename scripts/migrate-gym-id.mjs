import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const projectId = process.env.FIREBASE_PROJECT_ID || 'atlas-gym-partner';
const gymId = process.env.GYM_ID || 'default-gym';
const apply = process.argv.includes('--apply');

initializeApp({
  credential: applicationDefault(),
  projectId,
});
const db = getFirestore();

const collections = [
  'users',
  'stats',
  'routine',
  'finances',
  'monthlyCashboxes',
  'cycles',
  'exercises',
  'gymExercises',
  'gymLayouts',
  'notificados',
];

const chunk = (items, size) => {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
};

async function migrateCollection(collectionName) {
  const snapshot = await db.collection(collectionName).get();
  const pending = snapshot.docs.filter((document) => !document.get('gymId'));

  if (!pending.length) {
    console.log(`${collectionName}: no changes needed`);
    return 0;
  }

  if (!apply) {
    console.log(`${collectionName}: ${pending.length} document(s) would receive gymId=${gymId}`);
    return pending.length;
  }

  for (const batchDocs of chunk(pending, 400)) {
    const batch = db.batch();
    batchDocs.forEach((document) => {
      batch.update(document.ref, { gymId });
    });
    await batch.commit();
  }

  console.log(`${collectionName}: migrated ${pending.length} document(s)`);
  return pending.length;
}

async function migrateModuleSettings() {
  const snapshot = await db.collection('moduleSettings').get();
  const pending = snapshot.docs.filter((document) => !document.get('gymId'));

  if (!pending.length) {
    console.log('moduleSettings: no changes needed');
    return 0;
  }

  if (!apply) {
    console.log(`moduleSettings: ${pending.length} document(s) would be copied to the tenant namespace`);
    return pending.length;
  }

  for (const batchDocs of chunk(pending, 200)) {
    const batch = db.batch();
    batchDocs.forEach((document) => {
      const data = document.data();
      const moduleName = data.moduleName || document.id;
      const targetRef = db.collection('moduleSettings').doc(`${gymId}__${moduleName}`);
      batch.set(targetRef, { ...data, moduleName, gymId }, { merge: true });
      batch.delete(document.ref);
    });
    await batch.commit();
  }

  console.log(`moduleSettings: migrated ${pending.length} document(s)`);
  return pending.length;
}

const total = (await Promise.all(collections.map(migrateCollection)))
  .reduce((sum, count) => sum + count, 0);
const settingsTotal = await migrateModuleSettings();

console.log(
  `${apply ? 'Migration complete' : 'Dry run complete'}: ${total + settingsTotal} document(s) ${apply ? 'migrated' : 'would be migrated'}`
);
