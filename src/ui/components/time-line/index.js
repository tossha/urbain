import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import PropTypes from "prop-types";

import TimeLineStore from "../../stores/time-line-store";
import "./index.scss";

@inject("timeLineStore")
@observer
class TimeLine extends Component {
    static propTypes = {
        className: PropTypes.string,
        timeLineStore: PropTypes.instanceOf(TimeLineStore),
    };

    componentDidMount() {
        const { timeLineStore } = this.props;

        timeLineStore.setTimeLineCanvasRef(this._timeLineCanvasRef.current);
    }

    _timeLineCanvasRef = React.createRef();

    render() {
        const { className } = this.props;

        return <canvas ref={this._timeLineCanvasRef} className={`time-line ${className}`} id="timeLineCanvas" />;
    }
}

export default TimeLine;
