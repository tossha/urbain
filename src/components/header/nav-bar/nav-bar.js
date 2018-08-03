import React from "react";
import "./nav-bar.css";
import { MainMenu } from "./components/main-menu/main-menu";
import StarSystemSelector from "./components/star-system-selector/star-system-selector";

function NavBar() {
    return <nav className="nav-bar">
        <MainMenu className="nav-bar__item"/>
        <div className="nav-bar__item nav-bar__item--separated">
            <StarSystemSelector />
        </div>
    </nav>;
}

export default NavBar;
