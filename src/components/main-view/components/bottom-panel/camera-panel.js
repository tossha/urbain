import React, { Fragment } from "react";
import PropTypes from "prop-types";

import "./camera-panel.css";
import Panel from "../../../common/panel";

const CameraPanel = ({ className }) => {
    return (
        <div className={className} id="cameraPanel">
            <Panel className="camera-panel" caption="Camera">
                <Fragment>
                    <label className="camera-panel__field">
                        Target: <select className="camera-panel__field-control" id="targetSelect" />
                    </label>
                    <label className="camera-panel__field">
                        Frame type: <select className="camera-panel__field-control" id="rfTypeSelect" />
                    </label>
                </Fragment>
            </Panel>
        </div>
    );
};

CameraPanel.propTypes = {
    className: PropTypes.string,
};

export default CameraPanel;
