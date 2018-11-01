import React from "react";
import cn from "classnames";

import { FieldLabel, FieldControl, Dimension } from "../../../../common/panel";
import "./vector-component-view.scss";

function VectorComponentView({ className, label = "x", valueClassName = "vec-x", dimension = "km" }) {
    return (
        <div className={cn(className, "vector-component")}>
            <FieldLabel className="vector-component__label">{label}</FieldLabel>
            <FieldControl className={valueClassName} />
            <Dimension>{dimension}</Dimension>
        </div>
    );
}

export default VectorComponentView;
