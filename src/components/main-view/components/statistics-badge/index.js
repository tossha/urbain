import React, { Component } from "react";
import Stats from "stats.js";

import { Consumer } from "../../../../store/index";
import "./index.css";

class StatisticsBadge extends Component {
    elementRef = React.createRef();

    componentDidMount() {
        this.elementRef.current.appendChild(this.props.stats.dom);
    }

    componentWillUnmount() {
        this.elementRef = null;
    }

    render() {
        return <div ref={this.elementRef} className="statistics-badge" />;
    }
}

export default () => (
    <Consumer>
        {({ store, stats }) => (store.viewSettings.showStatistics ? <StatisticsBadge stats={stats} /> : null)}
    </Consumer>
);

export function createStatsBadge() {
    const statsBadge = new Stats();
    statsBadge.dom.classList.add("stats-badge");

    return statsBadge;
}
