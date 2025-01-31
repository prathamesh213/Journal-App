import React from "react";

const Result = ({ questionScore, imageScore, overallScore, audioScore }) => {
  // Retrieve captured images from local storage
  const capturedImages = JSON.parse(localStorage.getItem("capturedImages"));
  //console.log(questionScore);
  //console.log(imageScore);
  //console.log(overallScore);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const email = userData.email;
  return (
    <div className=" min-h-screen flex flex-col justify-evenly items-center">
      <h1 className="text-black text-4xl font-bold mb-8">
        Test Score: {questionScore}
      </h1>

      <div className="flex flex-wrap bg-whi  justify-evenly w-full ">
        {capturedImages.map((imageData, index) => (
          <div
            key={index}
            className="m-4 border   p-6 rounded-xl shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]"
          >
            <img
              src={imageData}
              alt={`Image ${index + 1}`}
              className="w-40 h-40 object-cover rounded-md"
            />
            <p className="text-black mt-2 text-lg">
              Image {index + 1} Mood: {imageScore[index]}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-evenly  w-full mx-32  ">
        {audioScore.map((score, index) => (
          <div
            key={index}
            className="text-black mt-2 m-4 text-xl p-4 px-6 rounded-md  shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]"
          >
            Audio {index + 1}: {score}
          </div>
        ))}
      </div>

      <h2 className="text-black text-4xl font-semibold mt-8">
        Overall Score: {overallScore}
      </h2>
      <p className="text-black text-lg">
        The results have been mailed to you at your email: {email}
      </p>
    </div>
  );
};

export default Result;
