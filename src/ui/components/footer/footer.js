import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import "./footer.scss";

const Footer = ({ className }) => <footer id="app-footer" className={cn("footer", className)} />;

Footer.propTypes = {
    className: PropTypes.string,
};

export default Footer;
