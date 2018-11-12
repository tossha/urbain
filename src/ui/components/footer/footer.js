import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { ReactComponent as GithubLogo } from "./github-logo.svg";
import { ReactComponent as TelegramLogo } from "./telegram-logo.svg";

import "./footer.scss";

const Footer = ({ className }) => (
    <footer id="app-footer" className={cn("footer", className)}>
        <div className="footer__wrapper">
            <span className="footer__description">
                &copy; 2016–
                {new Date().getFullYear()} Urbain - Traversing the Solar System
            </span>
            <span className="footer__social-links">
                <a
                    className="footer__social-link"
                    href="https://github.com/tossha/urbain"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <GithubLogo className="footer__social-link-logo" />
                </a>
                <a
                    className="footer__social-link"
                    href="https://t.me/more_yasnosti_chat"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <TelegramLogo className="footer__social-link-logo" />
                </a>
            </span>
        </div>
    </footer>
);

Footer.propTypes = {
    className: PropTypes.string,
};

export default Footer;
