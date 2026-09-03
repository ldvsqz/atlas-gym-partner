import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const projectId = process.env.FIREBASE_PROJECT_ID || 'atlas-gym-partner';
const apply = process.argv.includes('--apply');

initializeApp({ credential: applicationDefault(), projectId });
const db = getFirestore();
const snapshot = await db.collection('users').where('rol', '==', 0).get();

console.log(`${snapshot.size} existing admin profile(s) found`);

if (apply) {
  for (const batchDocs of Array.from({ length: Math.ceil(snapshot.docs.length / 400) }, (_, index) => (
    snapshot.docs.slice(index * 400, (index + 1) * 400)
  ))) {
    const batch = db.batch();
    batchDocs.forEach((document) => batch.update(document.ref, { rol: 2 }));
    await batch.commit();
  }
  console.log('Existing admin profiles promoted to super admin');
} else {
  console.log('Dry run only. Re-run with --apply to promote these profiles.');
}
