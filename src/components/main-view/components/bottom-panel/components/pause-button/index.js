import React, { Component } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cn from "classnames";

import { sim, Events } from "../../../../../../core/index";
import "./index.scss";

class PauseButton extends Component {
    static propTypes = {
        className: PropTypes.string,
    };

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
            <div
                role="button"
                className={cn(
                    "pause-button",
                    "noselect",
                    {
                        "pause-button--paused": !isTimeRunning,
                    },
                    this.props.className,
                )}
                onClick={this.handleClick}
            >
                <div>
                    <FontAwesomeIcon className="pause-button__icon" icon={isTimeRunning ? "pause" : "play"} />
                </div>
                <div>{isTimeRunning ? "Pause" : "Resume"}</div>
            </div>
        );
    }
}

export default PauseButton;
