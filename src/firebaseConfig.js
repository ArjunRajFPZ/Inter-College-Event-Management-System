import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
 
// Initialize Firebase
const app = initializeApp ({
    apiKey: "AIzaSyDgpKnIYRAeQoLpIOTuwiofXHR9Q4d82sA",
    authDomain: "eventmanagement-c9302.firebaseapp.com",
    projectId: "eventmanagement-c9302",
    storageBucket: "eventmanagement-c9302.appspot.com",
    messagingSenderId: "209929917221",
    appId: "1:209929917221:web:67ecf7609ef55da73940cc",
    measurementId: "G-3NVCW3PSS2"
});

// Firebase storage reference
const storage = getStorage(app);
export default storage;