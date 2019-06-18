import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import { ReactComponent as PlayIcon } from "../../../../../common/images/play.svg";
import { ReactComponent as PauseIcon } from "../../../../../common/images/pause.svg";

import "./index.scss";

function PauseButton({ className, isPaused, onTogglePause }) {
    const classNames = cn(
        "pause-button",
        "noselect",
        {
            "pause-button--paused": isPaused,
        },
        className,
    );

    return (
        <div role="button" className={classNames} onClick={onTogglePause}>
            <div>{isPaused ? <PlayIcon /> : <PauseIcon />}</div>
            <div>{isPaused ? "Resume" : "Pause"}</div>
        </div>
    );
}

PauseButton.defaultProps = {
    className: PropTypes.string,
    isPaused: PropTypes.bool.isRequired,
    onTogglePause: PropTypes.func.isRequired,
};

export default PauseButton;
