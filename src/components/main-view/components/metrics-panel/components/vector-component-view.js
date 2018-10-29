import React from "react";
import cn from "classnames";

import "./vector-component-view.scss";

function VectorComponentView({ className, label = "x", valueClassName = "vec-x", dimension = "km" }) {
    return (
        <div className={cn(className, "vector-component")}>
            <span className="vector-component__label">{label}</span>
            <span className={cn("panel__field-control", valueClassName)} />
            <span className="panel__dimension">{dimension}</span>
        </div>
    );
}

export default VectorComponentView;
