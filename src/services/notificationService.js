import { getToken, onMessage } from 'firebase/messaging';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, messaging } from '../../Firebase/firebase';

class NotificationService {
  static #instance;
  static #registrationRequests = new Map();

  static getInstance() {
    if (!NotificationService.#instance) {
      NotificationService.#instance = new NotificationService();
    }
    return NotificationService.#instance;
  }

  isSupported() {
    return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
  }

  getPermissionStatus() {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission;
  }

  async requestAndRegisterToken(uid) {
    if (NotificationService.#registrationRequests.has(uid)) {
      return NotificationService.#registrationRequests.get(uid);
    }

    const request = this.#requestAndRegisterToken(uid);
    NotificationService.#registrationRequests.set(uid, request);
    request.catch(() => NotificationService.#registrationRequests.delete(uid));
    return request;
  }

  async #requestAndRegisterToken(uid) {
    if (!this.isSupported()) {
      console.warn('Notifications not supported in this browser.');
      return null;
    }

    if (!uid) {
      console.warn('Cannot register FCM token without user UID.');
      return null;
    }

    try {
      const permission = Notification.permission === 'default'
        ? await Notification.requestPermission()
        : Notification.permission;
      if (permission !== 'granted') {
        console.log('Notification permission was not granted.');
        return null;
      }

      // Register or ensure service worker is active
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      await navigator.serviceWorker.ready;

      if (!messaging) {
        console.warn('Firebase Messaging instance is not ready.');
        return null;
      }

      const token = await getToken(messaging, {
        serviceWorkerRegistration: registration,
      });

      if (token) {
        await this.saveTokenToUser(uid, token);
        console.log('FCM Token registered successfully:', token);
        return token;
      }
    } catch (error) {
      console.error('Error requesting notification token:', error);
    }
    return null;
  }

  async saveTokenToUser(uid, token) {
    if (!uid || !token) return;
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        fcmTokens: arrayUnion(token),
        lastFcmToken: token,
        lastTokenUpdated: new Date()
      });
    } catch (error) {
      console.error('Error saving FCM token to Firestore:', error);
    }
  }

  onForegroundMessage(callback) {
    if (!messaging) return () => {};
    return onMessage(messaging, (payload) => {
      console.log('Foreground notification received:', payload);
      if (callback) {
        callback(payload);
      }
    });
  }
}

export default NotificationService.getInstance();
