import React from "react";
import { inject, observer } from "mobx-react";

import { StatisticsBadge } from "./statistics-badge";
import "./index.scss";

export default inject(({ statisticsBadgeStore }) => ({
    isStatisticsBadgeVisible: statisticsBadgeStore.isStatisticsBadgeVisible,
    statistics: statisticsBadgeStore.statistics,
}))(
    observer(({ isStatisticsBadgeVisible, statistics }) => {
        return isStatisticsBadgeVisible ? <StatisticsBadge domElement={statistics.dom} /> : null;
    }),
);
