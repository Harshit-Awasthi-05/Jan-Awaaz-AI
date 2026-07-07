import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onIdTokenChanged, signOut } from "firebase/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [citizenUser, setCitizenUser] = useState(null);
  const [citizenToken, setCitizenToken] = useState(null);
  const [citizenLoading, setCitizenLoading] = useState(true);
  const [mpToken, setMpToken] = useState(() => localStorage.getItem("mpToken"));
  const [mpInfo, setMpInfo] = useState(() => {
    const info = localStorage.getItem("mpInfo");
    return info ? JSON.parse(info) : null;
  });

  useEffect(() => {
    
    
    
    
    
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

  const mpLogin = async (token, info) => {
    
    
    
    if (auth.currentUser) {
      await signOut(auth);
    }
    localStorage.setItem("mpToken", token);
    localStorage.setItem("mpInfo", JSON.stringify(info));
    setMpToken(token);
    setMpInfo(info);
  };

  const mpLogout = () => {
    localStorage.removeItem("mpToken");
    localStorage.removeItem("mpInfo");
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