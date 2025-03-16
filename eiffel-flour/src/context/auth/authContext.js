import React, { createContext, useState } from "react";


// persistant auth state
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [ isAuth, setIsAuth ] = useState(
    localStorage.getItem('isAuth') === 'true' || false
  );

  const login = () => {
    setIsAuth(true);
    localStorage.setItem('isAuth', true);
  };

  const logout = () => {
    setIsAuth(false);
    localStorage.removeItem('isAuth');
  }

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };
export default AuthContext;