import React from "react";
import cn from "classnames";

import { ReactComponent as ArrowToIcon } from "../images/arrow-to.svg";
import "./arrow-logo.scss";

export default function ArrowLogo({ direction }) {
    const classNames = cn("arrow-logo", `arrow-logo--to-${direction}`);

    return <ArrowToIcon className={classNames} />;
}
