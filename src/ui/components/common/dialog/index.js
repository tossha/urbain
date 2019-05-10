import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import Draggable from "react-draggable";

import { ReactComponent as CloseIcon } from "../images/cross.svg";
import "./index.scss";

class Dialog extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        caption: PropTypes.string,
        draggable: PropTypes.bool,
        onClose: PropTypes.func,
        isOpen: PropTypes.bool,
        children: PropTypes.node,
    };

    static defaultProps = {
        caption: "Dialog",
        draggable: false,
        onClose() {},
        isOpen: false,
    };

    _handleClose = () => {
        this.props.onClose();
    };

    render() {
        const { className, caption, isOpen, children, draggable } = this.props;
        const classNames = cn(
            "dialog",
            {
                "dialog--open": isOpen,
                "dialog--draggable": draggable,
            },
            className,
        );

        return (
            <Draggable handle=".dialog__header" disabled={!draggable}>
                <div className={classNames}>
                    <div className="dialog__header">
                        <div className="dialog__caption">{caption}</div>
                        <div className="dialog__close-button" onClick={this._handleClose}>
                            <CloseIcon className="dialog__close-button-icon" />
                        </div>
                    </div>
                    <div className="dialog__body">{children}</div>
                </div>
            </Draggable>
        );
    }
}

export default Dialog;
