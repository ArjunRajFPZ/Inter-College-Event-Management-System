import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
 
// Initialize Firebase
const app = initializeApp ({
//     PUT FIREBASE CONFIGRATION HERE
});

// Firebase storage reference
const storage = getStorage(app);
export default storage;
