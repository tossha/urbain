import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./camera-panel.scss";
import Panel from "../../../../../common/panel";

const CameraPanel = ({ className }) => (
    <Panel
        id="cameraPanel"
        className={`camera-panel ${className}`}
        caption="Camera"
        titleIcon={<FontAwesomeIcon icon="expand" />}
        collapseDirection="right"
    >
        <div className="panel__field camera-panel__field">
            <span className="panel__field-label">Target:</span>
            <select className="camera-panel__field-control" id="targetSelect" />
        </div>
        <div className="panel__field camera-panel__field">
            <span className="panel__field-label">Frame type:</span>
            <select className="camera-panel__field-control" id="rfTypeSelect" />
        </div>
    </Panel>
);

export default CameraPanel;
