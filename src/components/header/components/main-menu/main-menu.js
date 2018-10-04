import React from "react";

import "./main-menu.css";
import DropDownMenu from "./drop-down-menu";
import { Consumer } from "../../../../store";

function MainMenu() {
    return (
        <nav className="main-menu">
            <Consumer>
                {({ store }) =>
                    store.topMenu.map(({ label }) => (
                        <div key={label} className="main-menu__item main-menu__item--clickable">
                            <DropDownMenu text={label} />
                        </div>
                    ))
                }
            </Consumer>
        </nav>
    );
}

export default MainMenu;
