import React, { useState } from "react";
import Recording from "./recording";
import { useEffect } from "react";
import StartRecording from "./startRecording";
import ClearAudio from "./clearAudio";
import Recorded from "./Recorded";

const AudioInput = ({
  name,
  audio,
  setAudio,
  setSubmitState,
  setProgressNo,
  progressNo,
  setFreezeTravel,
  questionNo,
  setQuestionNo,
}) => {
  const [recording, setRecording] = useState(false);
  const [isRecorded, setIsRecorded] = useState(false);
  useEffect(() => {
    console.log(name.toString());
    const storedRecordedValue = localStorage.getItem(name.toString());
    if (storedRecordedValue === "true") {
      setIsRecorded(true);
    } else {
      setIsRecorded(false);
    }
  }, [name]);
  const startRecording = async () => {
    try {
      setRecording(true);
      setIsRecorded(true);
      setFreezeTravel(true);
      localStorage.setItem(name.toString(), "true");
      // Set recording to true
      const res =setTimeout(() => {
        setRecording(false); // Set recording back to false after 3.5 seconds
      }, 3500);
      const startResponse = await fetch("http://localhost:5000/record", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Optionally, you can send additional data in the request body if needed
        // body: JSON.stringify({ someData: 'value' })
      });
      const moodJson = await startResponse.json();
      const mood = moodJson.mood;
      setAudio(mood);
      console.log(audio);
      if (!startResponse.ok) {
        throw new Error(
          "Failed to start recording: " + startResponse.statusText
        );
      }
      // const res = await new Promise((resolve) => {
      //   setTimeout(() => {
      //     setRecording(false); // Set recording back to false after 3.5 seconds
      //     resolve(); // Resolve the Promise after 3.5 seconds
      //   }, 3500);
      // });

      setRecording(false);
      setFreezeTravel(false);
      if (questionNo < 24) {
        setQuestionNo(questionNo + 1);
      }
      const responsearr = JSON.parse(localStorage.getItem("response"));
      let allAnswered = responsearr.every((answer) => answer !== null);
      let finalstate = true;
      if (allAnswered) {
        if (!localStorage.getItem("audio1")) {
          finalstate = false;
        }
        if (!localStorage.getItem("audio2")) {
          finalstate = false;
        }
        if (!localStorage.getItem("audio3")) {
          finalstate = false;
        }
        if (!localStorage.getItem("audio4")) {
          finalstate = false;
        }
        if (!localStorage.getItem("audio5")) {
          finalstate = false;
        }
        if (!localStorage.getItem("audio6")) {
          finalstate = false;
        }
        if (!localStorage.getItem("audio7")) {
          finalstate = false;
        }
      }
      if (allAnswered && finalstate) {
        setSubmitState(true);
      } else {
        setSubmitState(false);
      }

      setProgressNo(progressNo + 1);
    } catch (error) {
      console.error("Error accessing microphone or recording:", error);
    }
  };

  return (
    <div className="flex-col">
      <div className=" flex justify-around">
        {!isRecorded && (
          <button onClick={startRecording} disabled={recording}>
            {recording ? <Recording /> : <StartRecording />}
          </button>
        )}
        {isRecorded && (
          <button onClick={startRecording} disabled={recording}>
            {recording ? <Recording /> : <Recorded />}
          </button>
        )}
      </div>
    </div>
  );
};

export default AudioInput;
