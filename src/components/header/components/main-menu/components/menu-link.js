import React from "react";
import PropTypes from "prop-types";

const MenuLink = ({ text, href, className = "", target = "_self" }) => (
    <a className={`main-menu__link ${className}`} href={href} target={target}>
        {text}
    </a>
);

MenuLink.propTypes = {
    text: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    className: PropTypes.string,
    target: PropTypes.string,
};

export default MenuLink;
