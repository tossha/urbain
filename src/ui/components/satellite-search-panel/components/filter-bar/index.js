import React from "react";
import PropTypes from "prop-types";
import Select from "../../../common/select/select";
import SatelliteFinder from "../../../../services/satellite-finder/satellite-finder";
import { FieldType } from "../../../../services/satellite-finder/api-config";

import "./index.scss";

class FilterBar extends React.Component {
    static propTypes = {
        satelliteFinder: PropTypes.instanceOf(SatelliteFinder).isRequired,
    };

    state = {
        searchQuery: "",
        searchFields: [],
    };

    async componentDidMount() {
        try {
            const searchFields = await this.props.satelliteFinder.getSearchSettings();

            this.setState({ searchFields });
        } catch (e) {
            console.error(e);
        }
    }

    _renderSearchField({ fieldName, fieldType, relations }) {
        const options = relations.map(relation => ({ label: relation, value: relation }));

        let input = null;

        switch (fieldType) {
            case FieldType.Number: {
                input = <input type="numeric" className="filter-bar__filter-pair-input" readOnly value={fieldName} />;
                break;
            }
            case FieldType.Date: {
                input = <input type="text" className="filter-bar__filter-pair-input" readOnly value={fieldName} />;
                break;
            }
            case FieldType.String: {
                input = <input type="text" readOnly className="filter-bar__filter-pair-input" value={fieldName} />;
                break;
            }
            default: {
                input = null;
                break;
            }
        }
        return (
            <div key={fieldName} className="filter-bar__filter-pair">
                {input}
                <Select className="filter-bar__filter-pair-select" options={options} />
            </div>
        );
    }

    render() {
        const { searchQuery, searchFields } = this.state;

        return (
            <div className="filter-bar">
                <div className="filter-bar__search-query-wrapper">
                    <input className="filter-bar__search-query-input" type="text" readOnly value={searchQuery} />
                </div>
                <div className="filter-bar__filters">
                    {searchFields.map(searchField => this._renderSearchField(searchField))}
                </div>
            </div>
        );
    }
}

export default FilterBar;
