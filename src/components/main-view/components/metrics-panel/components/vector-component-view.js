import React from "react";
import cn from "classnames";

import "./vector-component-view.css";

function VectorComponentView({ className, label = "x", valueClassName = "vec-x", dimension = "km" }) {
    return (
        <div className={cn(className, "vector-component")}>
            <span className="vector-component__label">{label}</span>
            <span className={cn("vector-component__value", valueClassName)} />
            <span className="metrics-panel__dimension vector-component__dimension">{dimension}</span>
        </div>
    );
}

export default VectorComponentView;
