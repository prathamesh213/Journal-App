import React from "react";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import circle from "../assets/circle.png";
const StepProgressBar = (props) => {
  const percentage = (props.progress / 25) * 100;
  //console.log(percentage);
  return (
    <div className="w-full">
      <ProgressBar
        height={25}
        percent={percentage}
        hasStepZero={false}
        filledBackground="linear-gradient(to right, #fff, #00d4ff)"
      ></ProgressBar>
    </div>
  );
};

export default StepProgressBar;
