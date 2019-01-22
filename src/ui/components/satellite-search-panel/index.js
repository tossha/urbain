import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import { createSimplebar } from "../common/simplebar";
import { RootContext } from "../../store";
import SatellitesGrid from "./components/satellites-grid/satellites-grid";
import Searcher from "./components/searcher";
import Dialog from "../common/dialog";

import "./index.scss";

class SatelliteSearchPanel extends React.Component {
    static contextType = RootContext;

    static propTypes = {
        className: PropTypes.string,
    };

    state = {
        satellites: [],
        filterBarVisible: true,
    };

    _containerRef = React.createRef();

    componentDidUpdate() {
        this._refreshScrollBar();
    }

    _refreshScrollBar() {
        if (this._containerRef.current) {
            if (!this._simplebar) {
                this._simplebar = createSimplebar(this._containerRef.current);
            }

            this._simplebar.recalculate();
        }
    }

    _searchSatellitesByName = async name => {
        const { satelliteFinder } = this.context.webApiServices;

        try {
            const { satellites } = await satelliteFinder.findSatellites({ name });

            return satellites;
        } catch (e) {
            console.error(e);
        }

        return [];
    };

    _handleSearch = async ({ noradId, name, launchDate }) => {
        const { satelliteFinder } = this.context.webApiServices;

        try {
            const { satellites } = await satelliteFinder.findSatellites({ noradId, name, launchDate });

            this.setState({
                satellites,
            });

            this._refreshScrollBar();
        } catch (e) {
            console.error(e);
        }
    };

    _handleClose = () => {
        const { store, updateStore } = this.context;

        store.viewSettings.satelliteSearchPanel.toggle();
        updateStore(store);
    };

    _renderOption = satellite => (
        <div className="satellite-option">
            <span className="satellite-option__norad-id">{satellite.noradId}</span>
            <span className="satellite-option__name">{satellite.name}</span>
            <span className="satellite-option__launch-date">{satellite.launchDate}</span>
        </div>
    );

    render() {
        const { className } = this.props;
        const { satellites } = this.state;
        const { store } = this.context;
        const { isVisible } = store.viewSettings.satelliteSearchPanel;

        return (
            <Dialog
                className={cn("satellite-search-panel", className)}
                caption="Satellite search panel"
                isOpen={isVisible}
                onClose={this._handleClose}
            >
                <Searcher
                    className="satellite-search-panel__searcher"
                    placeholder="Start typing satellite name ..."
                    onSource={this._searchSatellitesByName}
                    onSearch={this._handleSearch}
                    renderOption={this._renderOption}
                />
                {satellites.length > 0 && (
                    <div className="satellite-search-panel__satellites satellites">
                        <div className="satellites__header">
                            Satellites
                            <span className="satellites__header-line" />
                        </div>
                        <div className="satellites__grid" ref={this._containerRef}>
                            <SatellitesGrid
                                satellites={satellites}
                                onSatelliteLoad={store.loadSatellite}
                                onSatelliteUnload={store.unloadSatellite}
                            />
                        </div>
                    </div>
                )}
            </Dialog>
        );
    }
}

export default SatelliteSearchPanel;
