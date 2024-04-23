import React, { useContext, useState } from "react";
import CryptoJS from "crypto-js";
import { ContextApi } from "../context/Context";

function Encrypt({ message }) {
  const { encryptedMessage, setEncryptedMessage } = useContext(ContextApi);

  const encryptMessage = () => {
    const encrypted = CryptoJS.AES.encrypt(message, "BCSE305L").toString();
    setEncryptedMessage(encrypted);
  };

  return (
    <div>
      <button
        className="p-1 border border-cyan-500 rounded-md shadow-md"
        onClick={encryptMessage} // Corrected onClick handler
      >
        Encrypt
      </button>
      {encryptedMessage && (
        <div>
          <h3>Encrypted Message:</h3>
          <p className="font-bold">{encryptedMessage}</p>
        </div>
      )}
    </div>
  );
}

export default Encrypt;
