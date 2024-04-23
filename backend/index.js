const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("hello");
});

app.use("/api/ecc", require("./routes/ecc"));
app.use("/api/eccverify", require("./routes/eccverify"));

app.listen(4000, () => {
  console.log("listening on port 4000");
});
