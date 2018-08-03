import React from "react";
import cn from "classnames";

import NavBar from "./nav-bar/nav-bar";

const Header = ({ className }) => (
    <header className={cn(className, "header")}>
        <NavBar/>
    </header>
);

export default Header;
