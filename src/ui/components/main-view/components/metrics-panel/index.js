import { inject, observer } from "mobx-react";
import MetricsPanel from "./components/metrics-panel";
import "./index.scss";

export default inject(({ selectedObjectMetricsStore }) => ({
    onMetricsPanelClose: selectedObjectMetricsStore.closeMetricsPanel,
}))(observer(MetricsPanel));
