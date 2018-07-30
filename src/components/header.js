import React from "react";
import "./header.css";

const Header = ({ className }) => (
    <header className={`${className} header`}>
        <nav className="nav-bar">
            <div className="nav-bar__item nav-bar__logo" />
            <div className="nav-bar__item nav-bar__main-menu main-menu">
                <div className="main-menu__item">Simulation</div>
                <div className="main-menu__item main-menu__item--with-caret">Edit</div>
                <div className="main-menu__item main-menu__item--with-caret">View</div>
                <div className="main-menu__item">Settings</div>
                <div className="main-menu__item">Help</div>
            </div>
            <div className="nav-bar__item nav-bar__solar-system-selector">
                <div className="solar-system-selector"></div>
            </div>
        </nav>
    </header>
);

export default Header;
