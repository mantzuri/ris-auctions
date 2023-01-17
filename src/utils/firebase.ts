import {
  AuthError,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { BidType, NewAuctionItemType, UserType } from "../types";
import {
  DocumentData,
  QuerySnapshot,
  SnapshotListenOptions,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { DEMO } from "./constants";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  // measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

// check if user exists in db by email
export const checkUserExists = async (email: string) => {
  const q = query(collection(db, "users"), where("email", "==", email));
  const docs = await getDocs(q);
  return docs.docs.length > 0;
};

// CHeck if user is admin value in db
export const checkUserIsAdmin = async () => {
  const q = query(collection(db, "users"), where("email", "==", auth.currentUser?.email || ""));
  const docs = await getDocs(q);
  return docs.docs[0].data().admin;
};


const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

const logInWithEmailAndPassword = async ({ email, password }: UserType) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    const error = e as AuthError;
    alert(error.message);
  }
};

const registerWithEmailAndPassword = async ({ email, password }: UserType) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      authProvider: "local",
      email,
    });
  } catch (e) {
    const error = e as AuthError;
    console.log(auth, email, password)
    alert(error.message);
  }
};

const sendPasswordReset = async (email: string) => {
  if (!email) {
    alert("Please enter your email address.");
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (e) {
    const error = e as AuthError;
    alert(error.message);
  }
};

const logout = () => {
  signOut(auth);
};

// const randomImage = () => `https://source.unsplash.com/random?sig=${Math.floor(Math.random() * 1000)}`;

export const createAuctionItem = async ({ title, subtitle, imageURL }: NewAuctionItemType) => {
  try {
    const docRef = await addDoc(collection(db, DEMO), {
      title,
      subtitle,
      imageURL,
    });
    return docRef.id;
  } catch (error) {
    return (error);
  }
};

export const bidOnItem = async ({ itemId, bidAmount }: BidType) =>
  await addDoc(collection(db, `${DEMO}-bids`), {
    itemId,
    bidAmount,
    bidderId: auth.currentUser?.uid || "-",
    timestamp: Timestamp.now(),
  });

export const streamAuctionItems = (
  listId: string,
  snapshots: (snapshots: QuerySnapshot) => void,
  error: (err: QuerySnapshot<DocumentData>) => never
) => onSnapshot(
  query(collection(db, listId)),
  snapshots as SnapshotListenOptions,
  error
);

export const streamAuctionBids = (
  itemId: string,
  listId: string,
  snapshots: (snapshots: QuerySnapshot) => void,
  error: (err: QuerySnapshot<DocumentData>) => never
) => onSnapshot(
  query(collection(db, listId), where("itemId", '==', itemId), orderBy("timestamp", 'desc'), limit(4)),
  snapshots as SnapshotListenOptions,
  error
);

// firebase soft delete item
export const deleteListing = async (itemId: string) => {
  try {
    // firebase get the document to be deleted
    const docRef = doc(db, DEMO, itemId);
    const docSnap = await getDoc(docRef);

    await addDoc(collection(db, `${DEMO}-deleted`), {
      itemId,
      deletedBy: auth.currentUser?.uid || "-",
      timestamp: Timestamp.now(),
      ...docSnap.data()
    });
    await deleteDoc(doc(db, DEMO, itemId));
  } catch
  (error) {
    console.error(error);
  } finally {
    console.log("deleted");
  }
};


export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
