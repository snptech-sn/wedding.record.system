import { EventItem, GiftRecord, AppUser } from '../types';
import {
  db,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
  onSnapshot,
} from '../lib/firebase';
import type { QuerySnapshot, DocumentSnapshot } from 'firebase/firestore';

export const EVENTS_COLLECTION = 'events';
export const GIFTS_COLLECTION = 'gifts';
export const USERS_COLLECTION = 'users';

// Real-time listener for Events
export function subscribeToEvents(
  onData: (events: EventItem[]) => void,
  onError?: (err: Error) => void
) {
  const eventsCol = collection(db, EVENTS_COLLECTION);
  return onSnapshot(
    eventsCol,
    (snapshot: QuerySnapshot) => {
      const items: EventItem[] = [];
      snapshot.forEach((docSnap: DocumentSnapshot) => {
        items.push(docSnap.data() as EventItem);
      });
      // Sort by date descending
      items.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      onData(items);
    },
    (err: Error) => {
      console.error('Firestore events sync error:', err);
      onError?.(err);
    }
  );
}

// Real-time listener for Gifts
export function subscribeToGifts(
  onData: (gifts: GiftRecord[]) => void,
  onError?: (err: Error) => void
) {
  const giftsCol = collection(db, GIFTS_COLLECTION);
  return onSnapshot(
    giftsCol,
    (snapshot: QuerySnapshot) => {
      const items: GiftRecord[] = [];
      snapshot.forEach((docSnap: DocumentSnapshot) => {
        items.push(docSnap.data() as GiftRecord);
      });
      // Sort by recordedAt descending
      items.sort((a, b) => (b.recordedAt || '').localeCompare(a.recordedAt || ''));
      onData(items);
    },
    (err: Error) => {
      console.error('Firestore gifts sync error:', err);
      onError?.(err);
    }
  );
}

// Real-time listener for Users
export function subscribeToUsers(
  onData: (users: AppUser[]) => void,
  onError?: (err: Error) => void
) {
  const usersCol = collection(db, USERS_COLLECTION);
  return onSnapshot(
    usersCol,
    (snapshot: QuerySnapshot) => {
      const items: AppUser[] = [];
      snapshot.forEach((docSnap: DocumentSnapshot) => {
        items.push(docSnap.data() as AppUser);
      });
      onData(items);
    },
    (err: Error) => {
      console.error('Firestore users sync error:', err);
      onError?.(err);
    }
  );
}

// Save or Update an Event to Cloud Firestore
export async function saveEventToCloud(event: EventItem): Promise<void> {
  const eventRef = doc(db, EVENTS_COLLECTION, event.id);
  await setDoc(eventRef, event, { merge: true });
}

// Delete Event from Cloud Firestore
export async function deleteEventFromCloud(eventId: string): Promise<void> {
  const eventRef = doc(db, EVENTS_COLLECTION, eventId);
  await deleteDoc(eventRef);
}

// Save or Update a Gift Record to Cloud Firestore
export async function saveGiftToCloud(gift: GiftRecord): Promise<void> {
  const giftRef = doc(db, GIFTS_COLLECTION, gift.id);
  await setDoc(giftRef, gift, { merge: true });
}

// Delete Gift Record from Cloud Firestore
export async function deleteGiftFromCloud(giftId: string): Promise<void> {
  const giftRef = doc(db, GIFTS_COLLECTION, giftId);
  await deleteDoc(giftRef);
}

// Save or Update App User to Cloud Firestore
export async function saveUserToCloud(user: AppUser): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, user.id);
  await setDoc(userRef, user, { merge: true });
}

// Delete User from Cloud Firestore
export async function deleteUserFromCloud(userId: string): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, userId);
  await deleteDoc(userRef);
}

// Seed initial data to Cloud Firestore if collections are empty
export async function seedInitialDataToCloud(
  initialEvents: EventItem[],
  initialGifts: GiftRecord[],
  initialUsers: AppUser[]
): Promise<boolean> {
  try {
    const eventsSnap = await getDocs(collection(db, EVENTS_COLLECTION));
    if (eventsSnap.empty) {
      console.log('Seeding initial data to Firebase Cloud Firestore...');
      const batch = writeBatch(db);

      for (const ev of initialEvents) {
        batch.set(doc(db, EVENTS_COLLECTION, ev.id), ev);
      }
      for (const gift of initialGifts) {
        batch.set(doc(db, GIFTS_COLLECTION, gift.id), gift);
      }
      for (const user of initialUsers) {
        batch.set(doc(db, USERS_COLLECTION, user.id), user);
      }

      await batch.commit();
      console.log('Seeding completed successfully.');
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to seed initial data to Cloud:', e);
    return false;
  }
}

// Force upload current local events & gifts to Cloud
export async function syncAllLocalToCloud(
  events: EventItem[],
  gifts: GiftRecord[],
  users: AppUser[]
): Promise<void> {
  const batch = writeBatch(db);
  for (const ev of events) {
    batch.set(doc(db, EVENTS_COLLECTION, ev.id), ev, { merge: true });
  }
  for (const gift of gifts) {
    batch.set(doc(db, GIFTS_COLLECTION, gift.id), gift, { merge: true });
  }
  for (const user of users) {
    batch.set(doc(db, USERS_COLLECTION, user.id), user, { merge: true });
  }
  await batch.commit();
}
