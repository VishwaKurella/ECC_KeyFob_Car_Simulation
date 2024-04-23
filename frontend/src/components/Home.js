import React, { useContext, useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import Encrypt from "./Encrypt";
import { ContextApi } from "../context/Context";

function Home() {
  const [time, setTime] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [receivedTime, setReceivedTime] = useState(null);
  const [carsent, setcarsent] = useState(null);
  const [hashMessage, setHashMessage] = useState();
  const { encryptedMessage, setEncryptedMessage } = useContext(ContextApi);
  const [auth, setAuth] = useState();
  const [okm, setOkm] = useState(false);
  const [status, setStatus] = useState(false);
  const [count, setCount] = useState(0);
  const handleSend = async () => {
    try {
      const apiResponse = await fetch("http://localhost:4000/api/ecc/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: encryptedMessage }),
      });

      if (!apiResponse.ok) {
        throw new Error(`HTTP error! Status: ${apiResponse.status}`);
      }
      const responseData = await apiResponse.json();
      console.log(responseData);
      setReceivedMessage(responseData.decryptedMessage);
      setHashMessage(responseData.newTime);
      const decryptedTime = CryptoJS.AES.decrypt(
        responseData.newTime,
        "BCSE305L"
      ).toString(CryptoJS.enc.Utf8);
      setReceivedTime(decryptedTime);
      setcarsent(decryptedTime);
      setOkm(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleVerify = async () => {
    console.log(okm);
    try {
      const apiResponse = await fetch("http://localhost:4000/api/eccverify/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          okm: okm,
          hashMessage: hashMessage,
          recivedTime: receivedTime,
        }),
      });

      if (!apiResponse.ok) {
        throw new Error(`HTTP error! Status: ${apiResponse.status}`);
      }
      const responseData = await apiResponse.json();
      console.log(responseData);
      setAuth(responseData.message);
      setStatus(responseData.status);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = () => {
    try {
      setReceivedTime(Math.floor(Math.random() * 1000));
    } catch (error) {
      console.log(error);
    }
  };

  const handleReset = () => {
    setTime(null);
    setReceivedMessage(null);
    setReceivedTime(null);
    setHashMessage(null);
    setEncryptedMessage(null);
    setAuth(null);
    setOkm(false);
    setCount(0);
    setcarsent(null);
  };

  const handleKeyChange = () => {
    try {
      setReceivedMessage(Math.floor(Math.random() * 1000));
    } catch (error) {
      console.log(error);
    }
  };

  const handleTime = () => {
    setTime(Math.floor(Math.random() * 1000));
  };

  useEffect(() => {
    if (auth) {
      if (status === false) {
        let temp = count + 1;
        setCount(temp);
      }
    }
  }, [status, auth, receivedTime]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div>
          <div className="text-xl font-bold">
            Click below to generate the random time.
          </div>
          <div className="">
            CPU Time: <span className="font-bold">{time}</span>
          </div>
          <button
            className="p-1 border border-black shadow-md rounded-lg"
            onClick={handleTime}
          >
            Generate
          </button>
        </div>
        <div className="flex space-x-3">
          <div className="flex flex-col border-2 border-solid rounded-md p-1">
            <div className="flex flex-col items-center">
              <p className="font-bold text-black"> Key fob time sent</p>
              <div>{time}</div>
            </div>
            <div className="flex flex-col items-center">
              <p className="font-bold text-black">kef fob time recived</p>
              <div>{receivedMessage}</div>
            </div>
          </div>
          <div className="flex flex-col border-2 border-solid rounded-md p-1">
            <div className="flex flex-col items-center">
              <p className="font-bold text-green-500"> Car Time Recived</p>
              <div>{carsent}</div>
            </div>
            <div className="flex flex-col items-center">
              <p className="font-bold text-green-500"> Car Time Sent</p>
              <div>{receivedTime}</div>
            </div>
          </div>
          <div className="flex flex-col items-center p-2 m-1 border-solid rounded-md border-2">
            <p className="text-purple-500 font-bold">Auth Fail Count.</p>
            <div>{count}</div>
          </div>
        </div>
      </div>
      {time && <Encrypt message={time.toString()} />}
      <div className="p-2 border border-red-600 rounded-md">
        <p className="text-2xl justify-center flex">Key Fob Actions</p>
        <div className="flex flex-row">
          <div className="space-x-5 w-full flex items-center">
            {encryptedMessage && (
              <button
                className="p-1 border border-cyan-500 rounded-md shadow-md"
                onClick={handleSend}
              >
                Send to ESP32
              </button>
            )}
            {receivedTime &&
              (receivedMessage === time.toString() ? (
                <button
                  className="p-1 border border-green-600 rounded-md shadow-md"
                  onClick={handleVerify}
                >
                  Send OK Signal to car
                </button>
              ) : (
                <div className="text-red-600 font-bold">
                  The Recived Key from Car doesnt Match
                </div>
              ))}
          </div>
          <div className="border-l-2 border-yellow-600 w-full flex flex-col items-center">
            <p className="font-bold flex justify-center">Function's</p>
            <div>
              <button
                className="text-red-600 p-1 border border-black shadow-md rounded-md"
                onClick={handleKeyChange}
              >
                Change Key Fob Time.
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-2 mt-5 border border-purple-600 rounded-md ">
        <p className="flex justify-center text-2xl mb-6">Car Responce Window</p>
        <div className="flex flex-row">
          <div className="w-full">
            {receivedMessage && (
              <div className="text-lg">
                The the number recived by the car is :{" "}
                <span className="font-bold">{receivedMessage}</span>
              </div>
            )}
            {receivedTime && (
              <div>
                <div className="text-lg">
                  The Encrypted time sent by car is :{" "}
                  <span className="font-bold">{hashMessage}</span>
                </div>
                <div className="text-lg">
                  The new time sent by the car is :{" "}
                  <span className="font-bold">{receivedTime}</span>
                </div>
                {receivedMessage === time.toString() ? (
                  ""
                ) : (
                  <div className="text-lg font-bold text-red-600">
                    Key's Dont match Connection Terminated.
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="border-l-2 border-yellow-600 w-full flex flex-col items-center">
            <p className="font-bold flex justify-center">Function's</p>
            <div>
              <button
                className="text-red-600 p-1 border border-black shadow-md rounded-md"
                onClick={handleChange}
              >
                Change recived car key Time.
              </button>
            </div>
          </div>
        </div>
      </div>
      {auth && (
        <div className="font-bold text-xl">
          the Message sent by car is{" "}
          <span className={`${status ? "text-green-600" : "text-red-600"}`}>
            {auth}
          </span>
        </div>
      )}
      <div className="flex justify-center">
        <button
          className="bg-green-500 text-white text-lg hover:bg-red-500 transition-all ease-in duration-75 border hover:border-red-400 border-green-400 rounded-md shadow-md p-2"
          onClick={handleReset}
        >
          Reset The System
        </button>
      </div>
    </div>
  );
}

export default Home;
