import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import { createSimplebar } from "../common/simplebar";
import { RootContext } from "../../store";
import Panel, { FieldSet, Field } from "../common/panel/index";
import SatellitesGrid from "./components/satellites-grid/satellites-grid";

import Searcher from "./components/searcher";
import "./index.scss";
import ExpandButton from "../common/expand-button";
import FilterBar from "./components/filter-bar";

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

    _handleSearch = async ({ noradId, launchDate }) => {
        const { satelliteFinder } = this.context.webApiServices;

        try {
            const { satellites } = await satelliteFinder.findSatellites(noradId, launchDate);

            this.setState({
                satellites: satellites.map(s => new Satellite(s)),
            });
        } catch (e) {
            console.error(e);
        }
    };

    _handleFilterBarToggle = () => {
        this.setState(({ filterBarVisible }) => ({ filterBarVisible: !filterBarVisible }));
    };

    render() {
        const { className } = this.props;
        const { satellites, filterBarVisible } = this.state;
        const { store, webApiServices } = this.context;
        const { showSatelliteSearchPanel } = store.viewSettings;

        return (
            <Panel
                className={cn("satellite-search-panel", className)}
                caption="Satellite search panel"
                hidden={!showSatelliteSearchPanel}
                collapseDirection="right"
            >
                <Field leftAligned>
                    <Searcher className="satellite-search-panel__searcher" onSearch={this._handleSearch} />
                </Field>
                <FieldSet>
                    <Field className="panel__field-header" centered>
                        Extended Filters
                        <ExpandButton
                            className="cartesian-vector-view__expand-button"
                            expanded={filterBarVisible}
                            onClick={this._handleFilterBarToggle}
                        />
                    </Field>
                    {filterBarVisible && (
                        <Field>
                            <FilterBar satelliteFinder={webApiServices.satelliteFinder} />
                        </Field>
                    )}
                </FieldSet>
                {satellites.length > 0 && (
                    <FieldSet>
                        <Field className="panel__field-header">Satellites</Field>
                        <Field>
                            <div className="satellites-grid-container" ref={this._containerRef}>
                                <div className="satellites-grid-wrapper">
                                    <SatellitesGrid
                                        satellites={satellites}
                                        onSatelliteLoad={store.loadSatellite}
                                        onSatelliteUnload={store.unloadSatellite}
                                    />
                                </div>
                            </div>
                        </Field>
                    </FieldSet>
                )}
            </Panel>
        );
    }
}

export default SatelliteSearchPanel;
