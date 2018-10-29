import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import "./keplerian-view.scss";

export default function KeplerianView({ className = "" }) {
    return (
        <div className={cn(className, "keplerian-view")}>
            <div className="keplerian-view__column">
                <div className="keplerian-view__field">
                    <span className="panel__field-label keplerian-view__field-label">Ecc</span>
                    <span className="panel__field-control" id="elements-ecc" />
                    <span className="panel__dimension" />
                </div>
                <div className="keplerian-view__field">
                    <span className="panel__field-label keplerian-view__field-label">SMA</span>
                    <span className="panel__field-control" id="elements-sma" />
                    <span className="panel__dimension">km</span>
                </div>
                <div className="keplerian-view__field">
                    <span className="panel__field-label keplerian-view__field-label">Inc</span>
                    <span className="panel__field-control" id="elements-inc" />
                    <span className="panel__dimension">deg.</span>
                </div>
                <div className="keplerian-view__field">
                    <span className="panel__field-label keplerian-view__field-label">AoP</span>
                    <span className="panel__field-control" id="elements-aop" />
                    <span className="panel__dimension">deg.</span>
                </div>
            </div>

            <div className="keplerian-view__column">
                <div className="keplerian-view__field">
                    <span className="panel__field-label keplerian-view__field-label">RAAN</span>
                    <span className="panel__field-control" id="elements-raan" />
                    <span className="panel__dimension">deg.</span>
                </div>
                <div className="keplerian-view__field">
                    <span className="panel__field-label keplerian-view__field-label">TA</span>
                    <span className="panel__field-control" id="elements-ta" />
                    <span className="panel__dimension">deg.</span>
                </div>
                <div className="keplerian-view__field">
                    <span className="panel__field-label keplerian-view__field-label">Period</span>
                    <span className="panel__field-control" id="elements-period" />
                    <span className="panel__dimension">days</span>
                </div>
            </div>
        </div>
    );
}

KeplerianView.propTypes = { className: PropTypes.string };
