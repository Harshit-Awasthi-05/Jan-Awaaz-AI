import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyApzrPWOlIIMwcL8zZSXbhAaCtdf_N61n0",
  authDomain: "jan-awaaz-ai.firebaseapp.com",
  projectId: "jan-awaaz-ai",
  storageBucket: "jan-awaaz-ai.firebasestorage.app",
  messagingSenderId: "198000804257",
  appId: "1:198000804257:web:1ee1d174a439c205490be0",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);


export { signInWithPhoneNumber };


auth.settings.appVerificationDisabledForTesting = true;


export function setupRecaptcha(containerId) {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
    });
  }
  return window.recaptchaVerifier;
}