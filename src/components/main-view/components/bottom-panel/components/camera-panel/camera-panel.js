import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./camera-panel.css";
import Panel from "../../../../../common/panel";

const CameraPanel = () => (
    <Panel id="cameraPanel" className="camera-panel" caption="Camera" titleIcon={<FontAwesomeIcon icon="expand" />}>
        <div className="camera-panel__content">
            <label className="panel__field camera-panel__field">
                <span className="panel__field-label">Target:</span>
                <select className="camera-panel__field-control" id="targetSelect" />
            </label>
            <label className="panel__field camera-panel__field">
                <span className="panel__field-label">Frame type:</span>
                <select className="camera-panel__field-control" id="rfTypeSelect" />
            </label>
        </div>
    </Panel>
);

export default CameraPanel;
