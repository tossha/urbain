import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import { ReactComponent as CloseIcon } from "../images/cross.svg";
import "./index.scss";

class Dialog extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        caption: PropTypes.string,
        onClose: PropTypes.func,
        isOpen: PropTypes.bool,
    };

    static defaultProps = {
        caption: "Dialog",
        onClose() {},
        isOpen: false,
    };

    _handleClose = () => {
        this.props.onClose();
    };

    render() {
        const { className, caption, isOpen, children } = this.props;
        const classNames = cn(
            "dialog",
            {
                "dialog--open": isOpen,
            },
            className,
        );

        return (
            <div className={classNames}>
                <div className="dialog__header">
                    <div className="dialog__caption">{caption}</div>
                    <div className="dialog__close-button" onClick={this._handleClose}>
                        <CloseIcon className="dialog__close-button-icon" />
                    </div>
                </div>
                <div className="dialog__body">{children}</div>
            </div>
        );
    }
}

export default Dialog;
