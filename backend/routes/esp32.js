const i2c = require("i2c-bus");
const i2cBus = i2c.openSync(1);
const ESP32_ADDRESS = 0x12;
function readFromESP32() {
  const buffer = Buffer.alloc(4);
  i2cBus.readI2cBlock(
    ESP32_ADDRESS,
    0,
    buffer.length,
    buffer,
    (err, bytesRead, buffer) => {
      if (err) {
        console.error("Error reading from ESP32:", err);
      } else {
        console.log("Received data from ESP32:", buffer.toString("utf8"));
      }
    }
  );
}

function writeToESP32(data) {
  const buffer = Buffer.from(data, "utf8");
  i2cBus.writeI2cBlock(
    ESP32_ADDRESS,
    0,
    buffer.length,
    buffer,
    (err, bytesWritten, buffer) => {
      if (err) {
        console.error("Error writing to ESP32:", err);
      } else {
        console.log("Data written to ESP32:", buffer.toString("utf8"));
      }
    }
  );
}
