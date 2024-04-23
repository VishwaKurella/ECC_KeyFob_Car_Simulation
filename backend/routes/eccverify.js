const express = require("express");
const router = express.Router();
const CryptoJS = require("crypto-js");

router.post("/", async (req, res) => {
  const { okm, hashMessage, recivedTime } = req.body;
  try {
    const time = CryptoJS.AES.decrypt(hashMessage, "BCSE305L").toString(
      CryptoJS.enc.Utf8
    );
    console.log("The key sent time is for verification: ", time);
    console.log("the signal is :", okm);
    if (time === recivedTime && okm) {
      res.json({ message: ": Authentication Successful", status: true });
    } else {
      res.json({
        message: ": Authentication failed, resetting the keys",
        status: false,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
