import { createContext } from "react";
import { useState } from "react";

export const ContextApi = createContext();

export function Context({ children }) {
  const [encryptedMessage, setEncryptedMessage] = useState(null);
  const contextValues = { encryptedMessage, setEncryptedMessage };

  return (
    <ContextApi.Provider value={contextValues}>{children}</ContextApi.Provider>
  );
}
