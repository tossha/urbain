import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import Stats from "stats.js";
import "./index.scss";

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

export default inject("appStore")(
    observer(({ appStore }) => {
        return appStore.visualObjects.statisticsBadge.isVisible ? (
            <StatisticsBadge stats={appStore.visualObjects.statisticsBadge.meta} />
        ) : null;
    }),
);

export function createStatsBadge() {
    const statsBadge = new Stats();
    statsBadge.dom.classList.add("stats-badge");

    return statsBadge;
}
