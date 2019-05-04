import React, { Component } from "react";
import PropTypes from "prop-types";

export class StatisticsBadge extends Component {
    static propTypes = {
        domElement: PropTypes.object.isRequired,
    };

    elementRef = React.createRef();

    componentDidMount() {
        this.elementRef.current.appendChild(this.props.domElement);
    }

    componentWillUnmount() {
        this.elementRef = null;
    }

    render() {
        return <div ref={this.elementRef} className="statistics-badge" />;
    }
}
