import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import Draggable from "react-draggable";

import { ReactComponent as CloseIcon } from "../images/cross.svg";
import "./index.scss";

class Dialog extends React.Component {
    static propTypes = {
        id: PropTypes.string,
        className: PropTypes.string,
        caption: PropTypes.string,
        draggable: PropTypes.bool,
        onClose: PropTypes.func,
        isOpen: PropTypes.bool,
        titleIcon: PropTypes.node,
        children: PropTypes.node,
    };

    static defaultProps = {
        id: "",
        caption: "Dialog",
        draggable: false,
        onClose() {},
        isOpen: false,
    };

    _handleClose = () => {
        this.props.onClose();
    };

    render() {
        const { id, className, caption, isOpen, children, draggable, titleIcon } = this.props;
        const classNames = cn(
            "dialog",
            {
                "dialog--open": isOpen,
                "dialog--draggable": draggable,
            },
            className,
        );
        const headerClass = "dialog__header";

        return (
            <Draggable handle={`.${headerClass}`} disabled={!draggable}>
                <div id={id} className={classNames}>
                    <div className={headerClass}>
                        <div className="dialog__caption">
                            {titleIcon && <span className="dialog__caption-icon">{titleIcon}</span>}
                            {caption}
                        </div>
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
