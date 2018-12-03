import React from "react";
import cn from "classnames";

import "./main-menu.scss";
import DropDownMenu from "./components/drop-down-menu";
import MenuLink from "./components/menu-link";
import { RootContext, MenuItemType } from "../../../../store";

function MainMenuItem({ menuItem, clickable }) {
    return (
        <div className="main-menu__item">
            <div className={cn(clickable && "main-menu__clickable-zone")}>
                {menuItem.type === MenuItemType.LINK && <MenuLink text={menuItem.label} {...menuItem} />}
                {menuItem.type === MenuItemType.DROPDOWN && <DropDownMenu text={menuItem.label} {...menuItem} />}
            </div>
        </div>
    );
}

function MainMenu() {
    return (
        <nav className="main-menu">
            <RootContext.Consumer>
                {({ store }) =>
                    store.topMenu.map(menuItem => (
                        <MainMenuItem key={menuItem.label} menuItem={menuItem} clickable={menuItem.isClickable} />
                    ))
                }
            </RootContext.Consumer>
        </nav>
    );
}

MainMenu.contextType = RootContext;

export default MainMenu;
