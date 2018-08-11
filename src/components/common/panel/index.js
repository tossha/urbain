import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import "./index.css";

class Panel extends Component {
    static propTypes = {
        id: PropTypes.string,
        className: PropTypes.string,
        children: PropTypes.node,
        caption: PropTypes.string,
        hideCollapseButton: PropTypes.bool,
        titleIcon: PropTypes.node,
        collapsedByDefault: PropTypes.bool,
        hidden: PropTypes.bool,
    };

    static defaultProps = {
        caption: "",
        hideCollapseButton: false,
        className: "",
        id: "",
        collapsedByDefault: false,
        hidden: false,
    };

    state = {
        isCollapsed: this.props.collapsedByDefault,
    };

    handleToggle = () => {
        this.setState(prevState => ({
            isCollapsed: !prevState.isCollapsed,
        }));
    };

    render() {
        const { id, className, caption, hideCollapseButton, children, titleIcon, hidden } = this.props;
        const { isCollapsed } = this.state;

        return (
            <div id={id} className={cn(className, "panel", { "panel--hidden": hidden })}>
                <header className="panel__header">
                    <div className="panel__caption">
                        {titleIcon && titleIcon}
                        {caption}
                    </div>
                    {!hideCollapseButton && (
                        <button type="button" className="panel__collapse-button" onClick={this.handleToggle}>
                            {isCollapsed ? "Show" : "Hide"}
                        </button>
                    )}
                </header>
                <div style={{ display: isCollapsed ? "none" : "block" }} className="panel__content">
                    {children}
                </div>
            </div>
        );
    }
}

export default Panel;
