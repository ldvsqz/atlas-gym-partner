import { db } from './firebase';
import { collection, doc, getDoc, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';

const SETTINGS_COLLECTION_NAME = 'moduleSettings';

class SettingsService {
  static #instance;

  static getInstance() {
    if (!SettingsService.#instance) {
      SettingsService.#instance = new SettingsService();
    }
    return SettingsService.#instance;
  }

  constructor() {}

  async getModuleSettings(moduleName) {
    try {
      const docRef = doc(db, SETTINGS_COLLECTION_NAME, moduleName);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return null;
      return { id: snapshot.id, ...snapshot.data() };
    } catch (error) {
      console.error('Error trying to get module settings:', error);
      throw error;
    }
  }

  async getAllModuleSettings() {
    try {
      const collRef = collection(db, SETTINGS_COLLECTION_NAME);
      const querySnapshot = await getDocs(collRef);
      const settings = {};
      querySnapshot.forEach((docSnapshot) => {
        settings[docSnapshot.id] = { id: docSnapshot.id, ...docSnapshot.data() };
      });
      return settings;
    } catch (error) {
      console.error('Error trying to get all module settings:', error);
      throw error;
    }
  }

  async saveModuleSettings(moduleName, overrides) {
    try {
      const docRef = doc(db, SETTINGS_COLLECTION_NAME, moduleName);
      const payload = {
        moduleName,
        overrides,
        updatedAt: serverTimestamp(),
      };
      await setDoc(docRef, payload, { merge: true });
      return { id: moduleName, ...payload };
    } catch (error) {
      console.error('Error trying to save module settings:', error);
      throw error;
    }
  }
}

export default SettingsService.getInstance();