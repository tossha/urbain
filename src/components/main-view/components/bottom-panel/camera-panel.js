import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import "./camera-panel.css";
import Panel from "../../../common/panel";

const CameraPanel = () => {
    return (
        <Panel
            id="cameraPanel"
            className="camera-panel"
            caption="Camera"
            titleIcon={<FontAwesomeIcon className="camera-panel__icon" icon="expand" />}
        >
            <label className="camera-panel__field">
                Target: <select className="camera-panel__field-control" id="targetSelect" />
            </label>
            <label className="camera-panel__field">
                Frame type: <select className="camera-panel__field-control" id="rfTypeSelect" />
            </label>
        </Panel>
    );
};

CameraPanel.propTypes = {
    className: PropTypes.string,
};

export default CameraPanel;
