import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import { createSimplebar } from "../../common/simplebar";
import SatellitesGrid from "./satellites-grid/satellites-grid";
import Searcher from "./searcher";
import { FilterItem } from "./filter-item";

import Dialog from "../../common/dialog";
import "../index.scss";

class SatelliteSearchPanel extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        isVisible: PropTypes.bool.isRequired,
        onSatellitesFind: PropTypes.func.isRequired,
        onSatelliteLoad: PropTypes.func.isRequired,
        onSatelliteUnload: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
    };

    state = {
        satellites: [],
        activeFilterValue: "noradId",
    };

    _containerRef = React.createRef();

    get _searcherPlaceholder() {
        return `Start typing satellite ${this.state.activeFilterValue} ...`;
    }

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

    _searchSatellites = async query => {
        if (!query) {
            return;
        }
        const searchParam = {
            [this.state.activeFilterValue]: query,
        };

        try {
            const { satellites } = await this.props.onSatellitesFind(searchParam);

            return satellites;
        } catch (e) {
            console.error(e);
        }

        return [];
    };

    _handleSearch = async query => {
        const satellites = await this._searchSatellites(query);

        this.setState(
            {
                satellites,
            },
            () => {
                this._refreshScrollBar();
            },
        );
    };

    _handleSelect = satellite => {};

    _handleClose = () => {
        this.props.onClose();
    };

    _renderOption = ({ noradId, name, launchDate }) => (
        <div className="satellite-option">
            <span className="satellite-option__norad-id">{noradId}</span>
            <span className="satellite-option__name">{name}</span>
            <span className="satellite-option__launch-date">{launchDate}</span>
        </div>
    );

    _handleParamSelectorChange = e => {
        this.setState({
            activeFilterValue: e.target.value,
        });
    };

    _renderFilter() {
        const { activeFilterValue } = this.state;

        return (
            <div className="satellite-search-panel__filter filter-selector">
                Search by:
                <FilterItem
                    filterId="noradId"
                    label="norad id"
                    value={activeFilterValue}
                    onSwitch={this._handleParamSelectorChange}
                />
                <FilterItem
                    filterId="name"
                    label="name"
                    value={activeFilterValue}
                    onSwitch={this._handleParamSelectorChange}
                />
                <FilterItem
                    filterId="launchDate"
                    label="launch date"
                    value={activeFilterValue}
                    onSwitch={this._handleParamSelectorChange}
                />
            </div>
        );
    }

    render() {
        const { className, isVisible, onSatelliteLoad, onSatelliteUnload } = this.props;
        const { satellites } = this.state;

        return (
            <Dialog
                className={cn("satellite-search-panel", className)}
                caption="Satellite search panel"
                isOpen={isVisible}
                onClose={this._handleClose}
            >
                <Searcher
                    className="satellite-search-panel__searcher"
                    placeholder={this._searcherPlaceholder}
                    onSource={this._searchSatellites}
                    onSearch={this._handleSearch}
                    onSelect={this._handleSelect}
                    renderOption={this._renderOption}
                />
                {this._renderFilter()}
                {satellites.length > 0 && (
                    <div className="satellite-search-panel__satellites satellites">
                        <div className="satellites__header">
                            Satellites
                            <span className="satellites__header-line" />
                        </div>
                        <div className="satellites__grid" ref={this._containerRef}>
                            <SatellitesGrid
                                satellites={satellites}
                                onSatelliteLoad={onSatelliteLoad}
                                onSatelliteUnload={onSatelliteUnload}
                            />
                        </div>
                    </div>
                )}
            </Dialog>
        );
    }
}

export default SatelliteSearchPanel;
