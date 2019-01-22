import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import { ReactComponent as PlayIcon } from "../../../../../common/images/play.svg";
import { ReactComponent as PauseIcon } from "../../../../../common/images/pause.svg";
import { sim, Events } from "../../../../../../../core/index";
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
                <div>{isTimeRunning ? <PauseIcon /> : <PlayIcon />}</div>
                <div>{isTimeRunning ? "Pause" : "Resume"}</div>
            </div>
        );
    }
}

export default PauseButton;
