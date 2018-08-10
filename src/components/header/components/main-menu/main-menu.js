import React from "react";
import PropTypes from "prop-types";
import { TOP_MENU_ITEMS } from "../../../../store/index"
import "./main-menu.css";
import DropDownMenu from "./drop-down-menu";

function MainMenu() {
    return (
        <nav className="main-menu">
            {Object.entries(TOP_MENU_ITEMS).map(([key, menuItemLabel]) => (
                <div key={key} className="main-menu__item main-menu__item--clickable">
                    <DropDownMenu text={menuItemLabel}/>
                </div>
            ))}
        </nav>
    );
}

MainMenu.propTypes = {
    className: PropTypes.string
};

export default MainMenu;
