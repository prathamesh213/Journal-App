import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";

const SidebarWithCamera = (props) => {
  const webcamRef = props.webcamRef;
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const getPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (stream) {
          setHasPermission(true);
          if (webcamRef.current) {
            webcamRef.current.video.srcObject = stream;
          }
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };

    getPermission();

    return () => {
      if (webcamRef.current) {
        webcamRef.current.video.srcObject = null;
      }
    };
  }, []);

  return (
    <div className="w-96 h-screen flex flex-col justify-around items-around  bg-white px-6">
      <div className="flex pt-10 items-center justify-center w-full">
        <h3 className="text-2xl font-semibold text-zinc-800">
          Depression Screening Test
        </h3>
      </div>
      <div className="flex-1  flex items-center justify-center">
        {" "}
        {/* Adjusted here */}
        {hasPermission ? (
          <div className="w-full h-auto mb-26 py-10 px-6 border-2  border-gray-300 shadow-lg rounded-md">
            <h2 className="text-lg mb-6">You're being watched right now.</h2>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={320}
              height={240}
              className="rounded-lg"
            />
          </div>
        ) : (
          <p className="text-red-500">Please allow access to the camera.</p>
        )}
      </div>
    </div>
  );
};

export default SidebarWithCamera;
