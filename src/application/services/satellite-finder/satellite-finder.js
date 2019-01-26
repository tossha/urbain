import axios from "axios";
import SearchApiParamsBuilder from "./search-api-params-builder";
import { FieldParameter, NumberFieldRelationType, ServerFieldName, StringFieldRelationType } from "./api-config";
import Satellite from "./satelite";

class SatelliteFinder {
    constructor(apiEndpoint) {
        this._apiUrl = apiEndpoint;
    }

    async findSatellites({ noradId, name, launchDate }) {
        try {
            const urlParams = this._createParams({ noradId, name, launchDate });
            const { data } = await axios.get(this._apiUrl, {
                params: urlParams,
            });

            return this._prepareResult(data);
        } catch (error) {
            console.error(error);
        }
    }

    async getSearchSettings() {
        return Promise.resolve(ServerFieldName.allValues.map(fieldName => new FieldParameter(fieldName)));
    }

    _prepareResult(serverResponseData) {
        if (this._isOk(serverResponseData)) {
            const { result } = serverResponseData;

            return {
                totalRows: result["total_rows"],
                satellites: result.satellites.map(s => new Satellite(s)),
            };
        } else if (this._isError(serverResponseData)) {
            console.error(serverResponseData.message);

            return {
                totalRows: 1,
                satellites: [],
            };
        }

        throw new Error("Unknown status code");
    }

    _createParams(config) {
        // TODO: Rewrite to more generic way
        const { noradId, launchDate, name } = config;
        const paramsBuilder = new SearchApiParamsBuilder();

        if (noradId) {
            paramsBuilder.addWithRelation(ServerFieldName.noradId, NumberFieldRelationType.Equal, noradId);
        }

        if (launchDate) {
            paramsBuilder.addWithRelation(ServerFieldName.launchDate, NumberFieldRelationType.Equal, launchDate);
        }

        if (name) {
            paramsBuilder.addWithRelation(ServerFieldName.name, StringFieldRelationType.Like, name);
        }

        paramsBuilder.limit(100);

        return paramsBuilder.build();
    }

    _isOk(resp) {
        return resp.status === "ok";
    }

    _isError(resp) {
        return resp.status === "error";
    }
}

export default SatelliteFinder;
