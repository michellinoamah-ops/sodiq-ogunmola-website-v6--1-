/* Firebase initialization (compat SDK, loaded via CDN in each page's head)
   Project: ogunmola-website
   This file is safe to expose publicly: Firebase web API keys identify the
   project, they do not grant access on their own. Access is controlled by
   the Firestore/Auth security rules deployed alongside this site
   (see /firestore.rules and /README.md). */

const firebaseConfig = {
  apiKey: "AIzaSyCIzZJPTBVGAc33litytGhw_FNp2Bx52w8",
  authDomain: "ogunmola-website.firebaseapp.com",
  projectId: "ogunmola-website",
  storageBucket: "ogunmola-website.firebasestorage.app",
  messagingSenderId: "391346300999",
  appId: "1:391346300999:web:1f1d21f915ab7005796962"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
