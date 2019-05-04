import { inject, observer } from "mobx-react";

import "./index.scss";
import SatelliteSearchPanel from "./satellite-search-panel";

export default inject(({ satelliteSearchPanelStore }) => ({
    isVisible: satelliteSearchPanelStore.isVisible,
    onSatellitesFind: satelliteSearchPanelStore.findSatellites,
    onClose: satelliteSearchPanelStore.closePanel,
    onSatelliteLoad: satelliteSearchPanelStore.loadSatellite,
    onSatelliteUnload: satelliteSearchPanelStore.unloadSatellite,
}))(observer(SatelliteSearchPanel));
