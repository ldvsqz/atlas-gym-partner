import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import { getCurrentGymId } from './tenant';

const TENANTS = 'gymTenants';
const REQUESTS = 'gymRequests';
const MEMBERSHIP_REQUESTS = 'gymMembershipRequests';
const TRANSFER_REQUESTS = 'gymTransferRequests';
const TENANT_DATA_COLLECTIONS = [
  'stats', 'routine', 'finances', 'monthlyCashboxes', 'gymExercises',
  'gymLayouts', 'cycles', 'exercises', 'notificados', 'moduleSettings',
];

class TenantService {
  async getAll(includeInactive = false) {
    const request = includeInactive
      ? getDocs(collection(db, TENANTS))
      : getDocs(query(collection(db, TENANTS), where('status', '==', 'active')));
    const snapshot = await request;
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  }

  async getRequests() {
    const snapshot = await getDocs(query(collection(db, REQUESTS), where('status', '==', 'pending')));
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  }

  async getMyRequests(uid) {
    if (!uid) return [];
    const collections = [REQUESTS, MEMBERSHIP_REQUESTS, TRANSFER_REQUESTS];
    const snapshots = await Promise.all(collections.map((name) => getDocs(
      query(collection(db, name), where('requestedBy', '==', uid)),
    )));
    return snapshots.flatMap((snapshot, index) => snapshot.docs.map((item) => ({
      id: item.id,
      type: collections[index],
      ...item.data(),
    })));
  }

  async getMembershipRequests(allGyms = false) {
    const gymId = allGyms ? null : await getCurrentGymId().catch(() => null);
    const requestQuery = gymId
      ? query(collection(db, MEMBERSHIP_REQUESTS), where('status', '==', 'pending'), where('gymId', '==', gymId))
      : query(collection(db, MEMBERSHIP_REQUESTS), where('status', '==', 'pending'));
    const snapshot = await getDocs(requestQuery);
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  }

  async getCurrentTenant() {
    const gymId = await getCurrentGymId();
    const snapshot = await getDoc(doc(db, TENANTS, gymId));
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  }

  async renameTenant(gymId, name) {
    const normalizedName = name.trim();
    if (!normalizedName) throw new Error('Gym name is required');
    await updateDoc(doc(db, TENANTS, gymId), { name: normalizedName });
  }

  async updateTenant(gymId, data) {
    const allowedData = {
      name: data.name?.trim(),
      status: data.status || 'active',
    };
    if (!allowedData.name) throw new Error('Gym name is required');
    await updateDoc(doc(db, TENANTS, gymId), allowedData);
  }

  async deleteTenant(gymId) {
    const [activeMembers, assignedAdmins] = await Promise.all([
      getDocs(query(collection(db, 'users'), where('gymId', '==', gymId))),
      getDocs(query(collection(db, 'users'), where('gymIds', 'array-contains', gymId))),
    ]);
    if (!activeMembers.empty || !assignedAdmins.empty) {
      throw new Error('Cannot delete a gym with assigned members');
    }

    const references = [];
    for (const collectionName of TENANT_DATA_COLLECTIONS) {
      const snapshot = await getDocs(query(collection(db, collectionName), where('gymId', '==', gymId)));
      snapshot.docs.forEach((item) => references.push(item.ref));
    }
    references.push(doc(db, TENANTS, gymId));

    for (let index = 0; index < references.length; index += 450) {
      const batch = writeBatch(db);
      references.slice(index, index + 450).forEach((reference) => batch.delete(reference));
      await batch.commit();
    }
  }

  async requestGym(user, name, details, requester = {}) {
    return addDoc(collection(db, REQUESTS), {
      requestedBy: user.uid,
      requestedByEmail: user.email || '',
      requester,
      name: name.trim(),
      details: details.trim(),
      status: 'pending',
      createdAt: serverTimestamp(),
    });
  }

  async requestMembership(user, gymId, details, requester = {}) {
    if (!user?.uid || !gymId) throw new Error('User and gym are required');
    return addDoc(collection(db, MEMBERSHIP_REQUESTS), {
      requestedBy: user.uid,
      requestedByEmail: user.email || '',
      requester,
      gymId,
      details: details.trim(),
      status: 'pending',
      createdAt: serverTimestamp(),
    });
  }

  async requestTransfer(user, gymId, details, requester = {}) {
    if (!user?.uid || !gymId) throw new Error('User and gym are required');
    return addDoc(collection(db, TRANSFER_REQUESTS), {
      requestedBy: user.uid,
      requestedByEmail: user.email || '',
      requester,
      currentGymId: requester.gymId || null,
      gymId,
      details: details.trim(),
      status: 'pending',
      createdAt: serverTimestamp(),
    });
  }

  async createGym(requestId, request, gymId) {
    const tenantRef = doc(db, TENANTS, gymId);
    await setDoc(tenantRef, {
      name: request.name,
      status: 'active',
      createdAt: serverTimestamp(),
      createdFromRequest: requestId,
    });
    await updateDoc(doc(db, 'users', request.requestedBy), { gymId, gymIds: [gymId], rol: 0 });
    await updateDoc(doc(db, REQUESTS, requestId), {
      status: 'approved',
      gymId,
      resolvedAt: serverTimestamp(),
    });
    return tenantRef;
  }

  async rejectRequest(requestId, type) {
    const collectionName = type === 'membership' ? MEMBERSHIP_REQUESTS : REQUESTS;
    await updateDoc(doc(db, collectionName, requestId), {
      status: 'rejected',
      resolvedAt: serverTimestamp(),
    });
  }

  async assignAdmin(uid, gymId) {
    const current = await getDoc(doc(db, 'users', uid));
    const existingGymIds = current.data()?.gymIds || (current.data()?.gymId ? [current.data().gymId] : []);
    const gymIds = [...new Set([...existingGymIds, gymId])];
    await updateDoc(doc(db, 'users', uid), { gymId, gymIds, rol: 0 });
  }

  async updateUserAssignment(uid, gymId, role) {
    const current = await getDoc(doc(db, 'users', uid));
    const data = current.data() || {};
    const existingGymIds = data.gymIds || (data.gymId ? [data.gymId] : []);
    const gymIds = role === 0
      ? [...new Set([...existingGymIds, gymId])]
      : (gymId ? [gymId] : []);
    await updateDoc(doc(db, 'users', uid), {
      gymId: gymId || null,
      gymIds,
      rol: role,
    });
  }

  async approveMembershipRequest(requestId, request) {
    await updateDoc(doc(db, 'users', request.requestedBy), {
      gymId: request.gymId,
      gymIds: [request.gymId],
      rol: 1,
    });
    await updateDoc(doc(db, MEMBERSHIP_REQUESTS, requestId), {
      status: 'approved',
      resolvedAt: serverTimestamp(),
    });
  }

  async rejectMembershipRequest(requestId) {
    await updateDoc(doc(db, MEMBERSHIP_REQUESTS, requestId), {
      status: 'rejected',
      resolvedAt: serverTimestamp(),
    });
  }

  async getTransferRequests(allGyms = false) {
    const gymId = allGyms ? null : await getCurrentGymId().catch(() => null);
    const requestQuery = gymId
      ? query(collection(db, TRANSFER_REQUESTS), where('status', '==', 'pending'), where('gymId', '==', gymId))
      : query(collection(db, TRANSFER_REQUESTS), where('status', '==', 'pending'));
    const snapshot = await getDocs(requestQuery);
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  }

  async approveTransferRequest(requestId, request) {
    const userRef = doc(db, 'users', request.requestedBy);
    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data() || {};
    const gymIds = userData.rol === 0
      ? [...new Set([...(userData.gymIds || []), request.gymId])]
      : [request.gymId];
    await updateDoc(userRef, { gymId: request.gymId, gymIds });
    await updateDoc(doc(db, TRANSFER_REQUESTS, requestId), {
      status: 'approved',
      resolvedAt: serverTimestamp(),
    });
  }

  async rejectTransferRequest(requestId) {
    await updateDoc(doc(db, TRANSFER_REQUESTS, requestId), {
      status: 'rejected',
      resolvedAt: serverTimestamp(),
    });
  }
}

export default new TenantService();
