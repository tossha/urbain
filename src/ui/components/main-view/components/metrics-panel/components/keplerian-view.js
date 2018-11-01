import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import { FieldLabel, FieldControl, Dimension } from "../../../../common/panel";
import "./keplerian-view.scss";

export default function KeplerianView({ className = "" }) {
    return (
        <div className={cn(className, "keplerian-view")}>
            <div className="keplerian-view__column">
                <div className="keplerian-view__field">
                    <FieldLabel className="keplerian-view__field-label">Ecc</FieldLabel>
                    <FieldControl id="elements-ecc" />
                    <Dimension />
                </div>
                <div className="keplerian-view__field">
                    <FieldLabel className="keplerian-view__field-label">SMA</FieldLabel>
                    <FieldControl id="elements-sma" />
                    <Dimension>km</Dimension>
                </div>
                <div className="keplerian-view__field">
                    <FieldLabel className="keplerian-view__field-label">Inc</FieldLabel>
                    <FieldControl id="elements-inc" />
                    <Dimension>deg.</Dimension>
                </div>
                <div className="keplerian-view__field">
                    <FieldLabel className="keplerian-view__field-label">AoP</FieldLabel>
                    <FieldControl id="elements-aop" />
                    <Dimension>deg.</Dimension>
                </div>
            </div>

            <div className="keplerian-view__column">
                <div className="keplerian-view__field">
                    <FieldLabel className="keplerian-view__field-label">RAAN</FieldLabel>
                    <FieldControl id="elements-raan" />
                    <Dimension>deg.</Dimension>
                </div>
                <div className="keplerian-view__field">
                    <FieldLabel className="keplerian-view__field-label">TA</FieldLabel>
                    <FieldControl id="elements-ta" />
                    <Dimension>deg.</Dimension>
                </div>
                <div className="keplerian-view__field">
                    <FieldLabel className="keplerian-view__field-label">Period</FieldLabel>
                    <FieldControl id="elements-period" />
                    <Dimension>days</Dimension>
                </div>
            </div>
        </div>
    );
}

KeplerianView.propTypes = { className: PropTypes.string };
