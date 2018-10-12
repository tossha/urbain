import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import { Consumer } from "../../../../store";
import Panel from "../../../common/panel";
import Button from "../../../common/button";
import SatellitesGrid from "./components/satellites-grid";
import "./index.scss";
import { findSatellites } from "./web-api";
import Satellite from "./satelite";

class SatelliteSearchPanel extends React.Component {
    static propTypes = {
        className: PropTypes.string,
    };

    state = {
        satId: "",
        launchDate: "",
        satellites: [],
    };

    get isFilterValid() {
        return Boolean(this.state.satId) || Boolean(this.state.launchDate); // TODO: Add a few more validation rules
    }

    handleSatIdChange = ({ target: { value } }) => {
        this.setState({
            satId: value,
        });
    };

    handleLaunchDateChange = ({ target: { value } }) => {
        this.setState({
            launchDate: value,
        });
    };

    handleSearch = async () => {
        try {
            const { satellites } = await findSatellites(this.state.satId, this.state.launchDate);

            this.setState({
                satellites: satellites.map(s => new Satellite(s)),
            });
        } catch (e) {
            console.error(e);
        }
    };

    render() {
        const { className } = this.props;
        const { satellites, satId, launchDate } = this.state;

        return (
            <Consumer>
                {({ store }) => (
                    <Panel
                        className={cn("satellite-search-panel", className)}
                        caption="Satellite search panel"
                        hidden={!store.viewSettings.showSatelliteSearchPanel}
                        collapseDirection="right"
                    >
                        <div>
                            <div className="panel__field-set">
                                <div className="panel__field panel__field--left-aligned">
                                    <div className="satellite-search-panel__searcher searcher">
                                        <div className="searcher__filter">
                                            <div className="searcher__column">
                                                <label>
                                                    Satellite Catalog Number
                                                    <input
                                                        className="searcher__input"
                                                        type="number"
                                                        value={satId}
                                                        step={1}
                                                        placeholder="NORAD ID min='1' max='43000+'"
                                                        min="1"
                                                        onChange={this.handleSatIdChange}
                                                    />
                                                </label>
                                            </div>
                                            <div className="searcher__column">
                                                <label>
                                                    Launch date
                                                    <input
                                                        className="searcher__input"
                                                        type="text"
                                                        placeholder={"YYYY-MM-DD"}
                                                        value={launchDate}
                                                        onChange={this.handleLaunchDateChange}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="searcher__search-button-wrapper">
                                            <Button
                                                className="searcher__search-button"
                                                text="search"
                                                disabled={!this.isFilterValid}
                                                onClick={this.handleSearch}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {satellites.length > 0 && (
                                <div className="panel__field-set">
                                    <div className="panel__field panel__field-header">Satellites</div>
                                    <div className="panel__field">
                                        <SatellitesGrid satellites={satellites} onSatelliteLoad={store.loadSatellite} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </Panel>
                )}
            </Consumer>
        );
    }
}

export default SatelliteSearchPanel;
