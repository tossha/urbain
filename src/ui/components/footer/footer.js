import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as faGithub from "@fortawesome/fontawesome-free-brands/faGithub";
import * as faTelegram from "@fortawesome/fontawesome-free-brands/faTelegram";

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
                    <FontAwesomeIcon className="footer__social-link-logo" icon={faGithub} />
                </a>
                <a
                    className="footer__social-link"
                    href="https://t.me/more_yasnosti_chat"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FontAwesomeIcon className="footer__social-link-logo" icon={faTelegram} />
                </a>
            </span>
        </div>
    </footer>
);

Footer.propTypes = {
    className: PropTypes.string,
};

export default Footer;
