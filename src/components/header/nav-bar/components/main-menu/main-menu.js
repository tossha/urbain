import React from "react";
import cn from "classnames";
import "./main-menu.css";

export function MainMenu({ className }) {
    return <div className={cn(className, "main-menu")}>
        <div className="main-menu__item main-menu__item--logo"/>
        <div className="main-menu__item main-menu__item--clickable">Simulation</div>
        <div className="main-menu__item main-menu__item--clickable main-menu__item--with-caret">Edit</div>
        <div className="main-menu__item main-menu__item--clickable main-menu__item--with-caret">View</div>
        <div className="main-menu__item main-menu__item--clickable">Settings</div>
        <div className="main-menu__item main-menu__item--clickable">Help</div>
    </div>;
}
