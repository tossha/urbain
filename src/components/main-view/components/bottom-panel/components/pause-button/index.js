import React, { Component } from "react";
import cn from "classnames";
import Events from "../../../../../../core/Events";
import { sim } from "../../../../../../core/Simulation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./index.css";

class PauseButton extends Component {
    state = {
        isTimeRunning: true,
    };

    constructor(props) {
        super(props);

        document.addEventListener(Events.TIME_PAUSED, () => {
            this.setState({ isTimeRunning: false });
        });
        document.addEventListener(Events.TIME_UNPAUSED, () => {
            this.setState({ isTimeRunning: true });
        });
    }

    handleClick = () => {
        const timeLine = sim.time;

        if (timeLine) {
            timeLine.togglePause();
        }
    };

    render() {
        const { isTimeRunning } = this.state;

        return (
            <span
                role="button"
                className={cn("pause-button", {
                    "pause-button--paused": !isTimeRunning,
                })}
                onClick={this.handleClick}
            >
                <div>
                    <FontAwesomeIcon className="pause-button__icon" icon={isTimeRunning ? "pause" : "play"} />
                </div>
                <div>{isTimeRunning ? "Pause" : "Resume"}</div>
            </span>
        );
    }
}

export default PauseButton;
