import React from "react";
import "./index.scss";

function TimeLine({ className }) {
    return <canvas className={`time-line ${className}`} id="timeLineCanvas" />;
}

export default TimeLine;
