import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onIdTokenChanged, signOut } from "firebase/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [citizenUser, setCitizenUser] = useState(null);
  const [citizenToken, setCitizenToken] = useState(null);
  const [citizenLoading, setCitizenLoading] = useState(true);
  const [mpToken, setMpToken] = useState(null);
  const [mpInfo, setMpInfo] = useState(null);

  useEffect(() => {
    // onIdTokenChanged fires on sign-in/sign-out AND whenever Firebase
    // silently refreshes the ID token (tokens expire after 1 hour).
    // onAuthStateChanged only fires on sign-in/sign-out, which left
    // citizenToken stale after an hour and caused every citizen API call
    // to fail with 401 for the rest of the session.
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setCitizenUser(user);
        setCitizenToken(token);
      } else {
        setCitizenUser(null);
        setCitizenToken(null);
      }
      setCitizenLoading(false);
    });
    return unsubscribe;
  }, []);

  const citizenLogout = () => signOut(auth);

  const mpLogin = (token, info) => {
    setMpToken(token);
    setMpInfo(info);
  };

  const mpLogout = () => {
    setMpToken(null);
    setMpInfo(null);
  };

  return (
    <AuthContext.Provider
      value={{
        citizenUser,
        citizenToken,
        citizenLoading,
        citizenLogout,
        mpToken,
        mpInfo,
        mpLogin,
        mpLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}