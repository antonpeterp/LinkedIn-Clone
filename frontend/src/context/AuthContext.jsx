import React, { createContext, useState } from "react";

export const authDataContext = createContext();

const AuthContext = ({ children }) => {
  const serverURL = "http://localhost:5000";

  let value = {
    serverURL,
  };

  return (
    <authDataContext.Provider value={value}>
      {children}
    </authDataContext.Provider>
  );
};

export default AuthContext;
