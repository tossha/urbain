import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import { RootContext } from "../../store";
import Panel, { FieldSet, Field } from "../common/panel/index";
import SatellitesGrid from "./components/satellites-grid/satellites-grid";

import Satellite from "./satelite";
import Searcher from "./components/searcher";
import "./index.scss";

class SatelliteSearchPanel extends React.Component {
    static contextType = RootContext;

    static propTypes = {
        className: PropTypes.string,
    };

    state = {
        satellites: [],
    };

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

    render() {
        const { className } = this.props;
        const { satellites } = this.state;
        const { store } = this.context;
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
                {satellites.length > 0 && (
                    <FieldSet>
                        <Field className="panel__field-header">Satellites</Field>
                        <Field>
                            <div className="satellites-grid-container">
                                <SatellitesGrid
                                    satellites={satellites}
                                    onSatelliteLoad={store.loadSatellite}
                                    onSatelliteUnload={store.unloadSatellite}
                                />
                            </div>
                        </Field>
                    </FieldSet>
                )}
            </Panel>
        );
    }
}

export default SatelliteSearchPanel;
