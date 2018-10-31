import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import CollapseButton from "./components/collapse-button";
import Field from "./components/field";
import FieldLabel from "./components/field-label";
import FieldControl from "./components/field-control";
import PanelButton from "./components/button";
import FieldSet from "./components/field-set";
import Dimension from "./components/dimension";
import "./index.scss";

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
        collapseDirection: PropTypes.oneOf(["right", "left"]),
    };

    static defaultProps = {
        caption: "",
        hideCollapseButton: false,
        className: "",
        id: "",
        collapsedByDefault: false,
        hidden: false,
        collapseDirection: "left",
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
        const {
            id,
            className,
            caption,
            hideCollapseButton,
            children,
            titleIcon,
            hidden,
            collapseDirection,
        } = this.props;
        const { isCollapsed } = this.state;
        const classNames = cn(
            "panel",
            "noselect",
            {
                "panel--hidden": hidden,
                "panel--collapsed": isCollapsed,
            },
            className,
        );

        return (
            <div id={id} className={classNames}>
                <div className="panel__header">
                    <div className="panel__caption">
                        {titleIcon && <span className="panel__caption-icon">{titleIcon}</span>}
                        <span className="panel__caption-text">{caption}</span>
                    </div>
                    {!hideCollapseButton && (
                        <CollapseButton
                            className="panel__collapse-button"
                            onClick={this.handleToggle}
                            isCollapsed={isCollapsed}
                            collapseDirection={collapseDirection}
                        />
                    )}
                </div>
                <div style={{ display: isCollapsed ? "none" : "block" }} className="panel__content">
                    {children}
                </div>
            </div>
        );
    }
}

export { Panel as default, Field, FieldSet, FieldLabel, FieldControl, PanelButton, Dimension };
