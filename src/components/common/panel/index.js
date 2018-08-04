import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import "./index.css";

class Panel extends Component {
    state = {
        isCollapsed: false,
    };

    handleToggle = () => {
        this.setState(prevState => ({
            isCollapsed: !prevState.isCollapsed,
        }))
    };

    render() {
        const { className, caption, hideCollapseButton, children, titleIcon } = this.props;
        const { isCollapsed } = this.state;

        return (
            <div className={cn("panel", className)}>
                <header className="panel__header">
                    {titleIcon && titleIcon}
                    <div className="panel__caption">{caption}</div>
                    {!hideCollapseButton &&
                        <button
                            type="button"
                            className="panel__collapse-button"
                            onClick={this.handleToggle}>
                            {isCollapsed ? "Show" : "Hide"}
                        </button>}
                </header>
                <div
                    style={{ display: isCollapsed ? "none": "block"}}
                    className="panel__content">
                    {children}
                </div>
            </div>
        );
    }
}

Panel.propTypes = {
    children: PropTypes.node,
    caption: PropTypes.string,
    hideCollapseButton: PropTypes.bool,
    className: PropTypes.string,
    titleIcon: PropTypes.node,
};

Panel.defaultProps = {
    caption: "",
    hideCollapseButton: false,
    className: "",
};

export default Panel;