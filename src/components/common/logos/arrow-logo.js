import React from "react";
import cn from "classnames";

import "./arrow-logo.css";

export default function ArrowLogo({ direction }) {
    const classNames = cn("arrow-logo", `arrow-logo--to-${direction}`);

    return (
        <svg
            className={classNames}
            role="img"
            width="10"
            height="8"
            viewBox="0 0 10 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M1.50359 3.64645C1.30833 3.84171 1.30833 4.15829 1.50359 4.35355L4.68557 7.53553C4.88083 7.7308 5.19741 7.7308 5.39268 7.53553C5.58794 7.34027 5.58794 7.02369 5.39268 6.82843L2.56425 4L5.39268 1.17157C5.58794 0.97631 5.58794 0.659728 5.39268 0.464466C5.19741 0.269204 4.88083 0.269203 4.68557 0.464466L1.50359 3.64645ZM1.5 8V0H0.5V8H1.5ZM10 3.5L1.85714 3.5L1.85714 4.5L10 4.5L10 3.5Z"
                fill="#8F9193"
            />
        </svg>
    );
}
