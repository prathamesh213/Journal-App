import SidebarWithCamera from "./sidebar";
import { useRef, useEffect, useState } from "react";
import questions from "../../questions.json";
import CustomProgressBar from "./progressbar";
import prev from "../assets/prev.png";
import next from "../assets/next.png";
import loading from "../assets/loading.gif";
import { json, useNavigate } from "react-router-dom";
import AudioInput from "./audioInput";
const ratingcss =
  "border border-sky-500 shadow-md rounded-xl w-24  h-10  text-xl hover:bg-sky-400 hover:text-white";
export default function Question(props) {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [questionNo, setQuestionNo] = useState(0);
  const [submitState, setSubmitState] = useState(false);
  const [responses, setResponses] = useState(Array(18).fill(null));
  const [progressNo, setProgressNo] = useState(0);
  const [noOfImage, setNoOfImgaes] = useState(0);
  const questionText = questions.questions[questionNo]?.question?.toString();
  const [audio1, setAudio1] = useState(null);
  const [audio2, setAudio2] = useState(null);
  const [audio3, setAudio3] = useState(null);

  const [audio4, setAudio4] = useState(null);
  const [audio5, setAudio5] = useState(null);
  const [audio6, setAudio6] = useState(null);
  const [audio7, setAudio7] = useState(null);
  const audios = [audio1, audio2, audio3, audio4, audio5, audio6, audio7];
  const setAudios = [
    setAudio1,
    setAudio2,
    setAudio3,
    setAudio4,
    setAudio5,
    setAudio6,
    setAudio7,
  ];
  const [submitLoading, setSubmitLoading] = useState(false);
  const [freezeTravel, setFreezeTravel] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("capturedImages")) {
      localStorage.removeItem("capturedImages");
    }
    if (localStorage.getItem("audio1")) {
      localStorage.removeItem("audio1");
    }
    if (localStorage.getItem("audio2")) {
      localStorage.removeItem("audio2");
    }
    if (localStorage.getItem("audio3")) {
      localStorage.removeItem("audio3");
    }
    if (localStorage.getItem("audio4")) {
      localStorage.removeItem("audio4");
    }
    if (localStorage.getItem("audio5")) {
      localStorage.removeItem("audio5");
    }
    if (localStorage.getItem("audio6")) {
      localStorage.removeItem("audio6");
    }
    if (localStorage.getItem("audio7")) {
      localStorage.removeItem("audio7");
    }
    const storedImages = JSON.parse(localStorage.getItem("capturedImages"));
    if (storedImages) {
      setCapturedImages(storedImages);
    }

    const storedResponse = JSON.parse(localStorage.getItem("response"));
    if (storedResponse) {
      setResponses(storedResponse);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("response", JSON.stringify(responses));
  }, [responses]);
  const handleSubmit = async () => {
    setSubmitLoading(true);
    const storedImages = JSON.parse(localStorage.getItem("capturedImages"));

    // Fetching audio content from the URLs
    const fetchAudioContent = async (audioURL) => {
      try {
        const response = await fetch(audioURL);
        if (!response.ok) {
          throw new Error("Failed to fetch audio content");
        }
        return await response.blob();
      } catch (error) {
        console.error("Error fetching audio content:", error);
        return null;
      }
    };

    // Fetch audio content for each audio URL

    const formData = new FormData();

    storedImages.forEach((image, index) => {
      formData.append(`image${index}`, image);
    });
    const userData = JSON.parse(localStorage.getItem("userData"));
    formData.append("responses", JSON.stringify(responses));
    formData.append("userInfo", JSON.stringify(userData));
    const audioScore = {
      audio1: audio1,
      audio2: audio2,
      audio3: audio3,
      audio4: audio4,
      audio5: audio5,
      audio6: audio6,
      audio7: audio7,
    };
    formData.append("audioScore", JSON.stringify(audioScore));
    const finaldata = {
      testScore: 14,
      overallScore: 78,
      imagesMood: ["happy", "sad", "neutral", "sad", "happy"],
      audioScore: [audio1, audio2, audio3, audio4, audio5, audio6, audio7],
    };
    console.log(formData.get("audioScore"));
    try {
      const setOverallScore = props.setOverallScore;
      const overallScore = props.overallScore;
      const setImageScore = props.setImageScore;
      const setQuestionScore = props.setQuestionScore;
      const setAudioScore = props.setAudioScore;
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      const finaldata = await response.json();
      console.log(finaldata);
      await setOverallScore(finaldata["overallScore"]);
      await setImageScore(finaldata["imagesMood"]);
      await setQuestionScore(finaldata["testScore"]);
      await setAudioScore(finaldata["audioScore"]);
      //console.log(overallScore);
      if (response.ok) {
      } else {
        console.error("Failed to send data.");
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }

    setSubmitLoading(false);
    navigate("/results");
  };
  const handleResponse = async (index, value) => {
    const updatedResponse = [...responses];
    updatedResponse[index] = value;
    await setResponses(updatedResponse);
    let count = 0;
    for (let i = 0; i < updatedResponse.length; i++) {
      if (updatedResponse[i] != null) {
        count++;
      }
    }
    if (
      (questionNo == 3 ||
        questionNo == 6 ||
        questionNo == 9 ||
        questionNo == 11 ||
        questionNo == 14) &&
      noOfImage < 5
    ) {
      captureImage();
      setNoOfImgaes(noOfImage + 1);
    }
    setProgressNo(count);
    let allAnswered = updatedResponse.every((answer) => answer !== null);
    if (allAnswered) {
      if (audio1 != "" || audio2 != "" || audio3 != "") {
        allAnswered = false;
      }
    }
    if (allAnswered) {
      setSubmitState(true);
    }
  };

  const captureImage = () => {
    let images = [];
    if (localStorage.getItem("capturedImages")) {
      images = JSON.parse(localStorage.getItem("capturedImages"));
    }

    if (images.length < 5 && webcamRef.current) {
      //console.log("webacm");
      const imageSrc = webcamRef.current.getScreenshot();
      const newCapturedImages = [...images, imageSrc]; // Use `images` instead of `capturedImages`
      setCapturedImages(newCapturedImages);
      localStorage.setItem("capturedImages", JSON.stringify(newCapturedImages));
    }
  };

  return (
    <div className="bg-custom-blue h-screen flex">
      <div className="flex-1">
        <SidebarWithCamera webcamRef={webcamRef} />
      </div>
      <div className="w-full h-full flex flex-col">
        <div className="w-full mt-5 px-10">
          <CustomProgressBar progress={progressNo} />
        </div>
        <div className="flex flex-col flex-1 items-start justify-center text-white ">
          <div className="flex items-end px-32  text-4xl font-semibold w-full h-40">
            Questions &nbsp; :
          </div>
          <div className="flex-1 w-full   flex flex-col justify-evenly items-center">
            <div className="bg-white h-4/6 w-5/6 rounded-xl text-black flex flex-col justify-around  shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
              <div className="text-2xl flex justify-start  w-full  px-10">
                Q.{questionNo + 1} {"  "} {questionText}
              </div>
              {questionNo < 17 && (
                <div className="flex justify-evenly">
                  <button
                    className="border border-red-500 shadow-md rounded-xl w-48  h-14 text-black  text-xl hover:bg-red-500 hover:text-white "
                    onClick={async () => {
                      await handleResponse(questionNo, 1);
                      if (questionNo !== 17) {
                        setQuestionNo(questionNo + 1);
                      }
                    }}
                  >
                    YES
                  </button>
                  <button
                    className="shadow-md rounded-xl w-48 border border-emerald-400 h-14 text-border  text-xl hover:bg-emerald-500 hover:text-white"
                    onClick={() => {
                      handleResponse(questionNo, 0);
                      if (questionNo !== 17) {
                        setQuestionNo(questionNo + 1);
                      }
                    }}
                  >
                    NO
                  </button>
                </div>
              )}
              {questionNo == 17 && (
                <div className=" flex flex-col">
                  <div className="flex justify-evenly px-32">
                    <button
                      className={ratingcss}
                      onClick={() => {
                        handleResponse(questionNo, 1);
                        setQuestionNo(questionNo + 1);
                      }}
                    >
                      1
                    </button>
                    <button
                      className={ratingcss}
                      onClick={() => {
                        handleResponse(questionNo, 2);
                        setQuestionNo(questionNo + 1);
                      }}
                    >
                      2
                    </button>
                    <button
                      className={ratingcss}
                      onClick={() => {
                        handleResponse(questionNo, 3);
                        setQuestionNo(questionNo + 1);
                      }}
                    >
                      3
                    </button>
                    <button
                      className={ratingcss}
                      onClick={() => {
                        handleResponse(questionNo, 4);
                        setQuestionNo(questionNo + 1);
                      }}
                    >
                      4
                    </button>
                    <button
                      className={ratingcss}
                      onClick={() => {
                        handleResponse(questionNo, 5);
                        setQuestionNo(questionNo + 1);
                      }}
                    >
                      5
                    </button>
                  </div>
                  <div className="w-full  flex  justify-between px-56 pt-4 text-xl  ">
                    <p className="text-gray-400  ml-6">Sad</p>
                    <p className="text-gray-400 mr-3">Happy</p>
                  </div>
                </div>
              )}
              {questionNo > 17 && questionNo < 25 && (
                <div className="text-gray-900  flex justify-center text-2xl  ">
                  {questions.questions[questionNo]?.audioText.toString()}
                </div>
              )}
              {questionNo > 17 && questionNo < 25 && (
                <AudioInput
                  questionNo={questionNo}
                  setQuestionNo={setQuestionNo}
                  name={`audio${questionNo - 17}`}
                  audio={audios[questionNo - 18]}
                  setAudio={setAudios[questionNo - 18]}
                  setSubmitState={setSubmitState}
                  setProgressNo={setProgressNo}
                  progressNo={progressNo}
                  setFreezeTravel={setFreezeTravel}
                ></AudioInput>
              )}
              {!freezeTravel && (
                <div className="flex justify-between px-20">
                  {questionNo != 0 && (
                    <button
                      className="flex ml-5 text-lg h-8 items-center justify-around w-24 px-12 border border-zinc-400 hover:bg-white rounded-md"
                      onClick={() => {
                        if (questionNo !== 0) {
                          setQuestionNo(questionNo - 1);
                        }
                      }}
                    >
                      Prev
                    </button>
                  )}
                  {questionNo != 24 && (
                    <button
                      className="flex ml-5 text-lg h-8 items-center justify-around w-24 px-12 border border-zinc-400 hover:bg-white rounded-md"
                      onClick={() => {
                        if (questionNo !== 24) {
                          setQuestionNo(questionNo + 1);
                        }
                      }}
                    >
                      Next
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <div className="flex  justify-center pb-32">
            {submitState && (
              <button
                className="h-12 bg-white text-black  min-w-48 p-2 rounded-xl shadow-md text-2xl  "
                onClick={async () => {
                  handleSubmit();
                }}
              >
                {!submitLoading && "Submit"}
                {submitLoading && "Processing..."}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
