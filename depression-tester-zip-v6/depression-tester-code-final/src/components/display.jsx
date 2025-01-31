import React from "react";

const DisplayCapturedImage = ({ image }) => {
  return (
    <div className="mt-4">
      <h3 className="text-xl font-bold mb-2">Captured Image</h3>
      <img src={image} alt="Captured" className="rounded-lg" />
    </div>
  );
};

export default DisplayCapturedImage;
