import { YonoApp, SiteSettings } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

// Lazy loaded Firebase instances to keep initial bundle ultra-fast & achieve 95+ Mobile PageSpeed
let firebasePromise: Promise<{
  db: import('firebase/firestore').Firestore;
  collection: typeof import('firebase/firestore').collection;
  doc: typeof import('firebase/firestore').doc;
  onSnapshot: typeof import('firebase/firestore').onSnapshot;
  setDoc: typeof import('firebase/firestore').setDoc;
  deleteDoc: typeof import('firebase/firestore').deleteDoc;
}> | null = null;

async function getFirebaseInstances() {
  if (!firebasePromise) {
    firebasePromise = (async () => {
      const { initializeApp } = await import('firebase/app');
      const { getFirestore, collection, doc, onSnapshot, setDoc, deleteDoc } = await import('firebase/firestore');
      const firebaseConfig = (await import('../../firebase-applet-config.json')).default;
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
      return { db, collection, doc, onSnapshot, setDoc, deleteDoc };
    })();
  }
  return firebasePromise;
}

/**
 * Subscribes to real-time updates for Apps from Firestore asynchronously.
 */
export function startAppsSync(
  onAppsUpdated: (apps: YonoApp[]) => void,
  onError?: (err: unknown) => void
): () => void {
  let isCancelled = false;
  let unsubscribeFn: (() => void) | null = null;

  // Defer execution slightly so browser paints initial UI first
  const timer = setTimeout(async () => {
    try {
      if (isCancelled) return;
      const { db, collection, onSnapshot } = await getFirebaseInstances();
      if (isCancelled) return;

      unsubscribeFn = onSnapshot(
        collection(db, 'apps'),
        (snapshot) => {
          if (!snapshot.empty) {
            const firestoreApps: YonoApp[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as YonoApp;
              if (data && data.id && data.name) {
                firestoreApps.push(data);
              }
            });
            if (firestoreApps.length > 0) {
              onAppsUpdated(firestoreApps);
            }
          }
        },
        (error) => {
          console.warn('Firestore apps sync notice:', error);
          if (onError) onError(error);
        }
      );
    } catch (e) {
      console.warn('Deferred apps sync notice:', e);
      if (onError) onError(e);
    }
  }, 1200);

  return () => {
    isCancelled = true;
    clearTimeout(timer);
    if (unsubscribeFn) {
      unsubscribeFn();
    }
  };
}

/**
 * Subscribes to real-time updates for Global Settings from Firestore asynchronously.
 */
export function startSettingsSync(
  onSettingsUpdated: (settings: Partial<SiteSettings>) => void,
  onError?: (err: unknown) => void
): () => void {
  let isCancelled = false;
  let unsubscribeFn: (() => void) | null = null;

  const timer = setTimeout(async () => {
    try {
      if (isCancelled) return;
      const { db, doc, onSnapshot } = await getFirebaseInstances();
      if (isCancelled) return;

      unsubscribeFn = onSnapshot(
        doc(db, 'settings', 'global'),
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as Partial<SiteSettings>;
            if (data && Object.keys(data).length > 0) {
              onSettingsUpdated(data);
            }
          }
        },
        (error) => {
          console.warn('Firestore settings sync notice:', error);
          if (onError) onError(error);
        }
      );
    } catch (e) {
      console.warn('Deferred settings sync notice:', e);
      if (onError) onError(e);
    }
  }, 1500);

  return () => {
    isCancelled = true;
    clearTimeout(timer);
    if (unsubscribeFn) {
      unsubscribeFn();
    }
  };
}

/**
 * Save single app to Firestore
 */
export async function saveAppToFirestore(app: YonoApp): Promise<void> {
  try {
    const { db, doc, setDoc } = await getFirebaseInstances();
    await setDoc(doc(db, 'apps', app.id), app, { merge: true });
  } catch (error) {
    console.error('Error saving app to Firestore:', error);
  }
}

/**
 * Delete single app from Firestore
 */
export async function deleteAppFromFirestore(appId: string): Promise<void> {
  try {
    const { db, doc, deleteDoc } = await getFirebaseInstances();
    await deleteDoc(doc(db, 'apps', appId));
  } catch (error) {
    console.error('Error deleting app from Firestore:', error);
  }
}

/**
 * Save site settings to Firestore
 */
export async function saveSettingsToFirestore(settings: SiteSettings): Promise<void> {
  try {
    const { db, doc, setDoc } = await getFirebaseInstances();
    await setDoc(doc(db, 'settings', 'global'), settings, { merge: true });
  } catch (error) {
    console.error('Error saving settings to Firestore:', error);
  }
}
