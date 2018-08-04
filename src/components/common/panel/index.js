import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import "./index.css";

class Panel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isCollapsed: this.props.collapsedByDefault,
        };
    }

    state = {
        isCollapsed: false,
    };

    handleToggle = () => {
        this.setState(prevState => ({
            isCollapsed: !prevState.isCollapsed,
        }))
    };

    render() {
        const { id, className, caption, hideCollapseButton, children, titleIcon } = this.props;
        const { isCollapsed } = this.state;

        return (
            <div id={id} className={cn("panel", className)}>
                <header className="panel__header">
                    <div className="panel__caption">
                        {titleIcon && titleIcon}
                        {caption}
                    </div>
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
    id: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
    caption: PropTypes.string,
    hideCollapseButton: PropTypes.bool,
    titleIcon: PropTypes.node,
    collapsedByDefault: PropTypes.bool,
};

Panel.defaultProps = {
    caption: "",
    hideCollapseButton: false,
    className: "",
    id: "",
    collapsedByDefault: false,
};

export default Panel;
