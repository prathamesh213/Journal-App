import "./App.css";
import "./index.css";
import Question from "./components/question";
import Welcome from "./components/welcome";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Results from "./components/results";
import { useState } from "react";
import AudioInput from "./components/audioInput";

function App() {
  const [questionScore, setQuestionScore] = useState(0);
  const [imageScore, setImageScore] = useState([]);
  const [overallScore, setOverallScore] = useState("");
  const [audioScore, setAudioScore] = useState([]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Welcome />}></Route>
        <Route
          path="/results"
          element={
            <Results
              questionScore={questionScore}
              imageScore={imageScore}
              overallScore={overallScore}
              audioScore={audioScore}
            />
          }
        ></Route>
        <Route
          path="/question"
          element={
            <Question
              overallScore={overallScore}
              setImageScore={setImageScore}
              setQuestionScore={setQuestionScore}
              setOverallScore={setOverallScore}
              setAudioScore={setAudioScore}
            ></Question>
          }
        ></Route>
        <Route path="/audio" element={<AudioInput />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
