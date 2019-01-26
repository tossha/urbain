class SearchApiParamsBuilder {
    _params = {};

    /**
     * @param {ServerFieldName} param
     * @param {string} value
     */
    addWithValue(param, value) {
        this._params[`fields[${param}][value]`] = value;

        return this;
    }

    /**
     * @param {ServerFieldName} paramName
     * @param {NumberFieldRelationType|DateFieldRelationType|StringFieldRelationType} relation
     * @param {string} valueToCompare
     */
    addWithRelation(paramName, relation, valueToCompare) {
        this.addWithValue(paramName, valueToCompare);
        this._params[`fields[${paramName}][relation]`] = relation;

        return this;
    }

    /**
     * @param {ServerFieldName} paramName
     */
    orderBy(paramName) {
        this._params["order"] = paramName;

        return this;
    }

    /**
     * @param {number=50} limit
     */
    limit(limit = 50) {
        this._params["limit"] = limit;

        return this;
    }

    build() {
        return this._params;
    }
}

export default SearchApiParamsBuilder;
