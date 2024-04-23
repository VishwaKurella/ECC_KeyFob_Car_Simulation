const express = require("express");
const router = express.Router();
const CryptoJS = require("crypto-js");

router.post("/", async (req, res) => {
  const { message } = req.body;
  try {
    const decryptedMessage = CryptoJS.AES.decrypt(message, "BCSE305L").toString(
      CryptoJS.enc.Utf8
    );
    console.log("the time set by key is :", decryptedMessage);
    const newTime = Math.floor(Math.random() * 1000).toString();
    console.log("the New time generated by car is: ", newTime);
    const encryptedNewTime = CryptoJS.AES.encrypt(
      newTime.toString(),
      "BCSE305L"
    ).toString();
    console.log("the encrypted time by car is: ", encryptedNewTime);
    res.json({ decryptedMessage, newTime: encryptedNewTime });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
