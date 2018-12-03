import axios from "axios";

class SatelliteFinder {
    constructor(apiEndpoint) {
        this._api = apiEndpoint;
    }

    async findSatellites(noradId, launchDate) {
        try {
            const params = this._createParams({ noradId, launchDate });
            const { data } = await axios.get(this._api, {
                params,
            });

            if (this._isOk(data)) {
                const { result } = data;

                return {
                    totalRows: result["total_rows"],
                    satellites: result.satellites,
                };
            } else if (this._isError(data)) {
                console.error(data.message);

                return {
                    totalRows: 1,
                    satellites: [],
                };
            }

            throw new Error("Unknown status code");
        } catch (error) {
            console.error(error);
        }
    }

    _createParams(config) {
        const { noradId, launchDate } = config;

        const params = {};
        if (noradId) {
            params["fields[norad_id][value]"] = noradId;
            params["fields[norad_id][relation]"] = "=";
        }

        if (launchDate) {
            params["fields[launch_date][value]"] = launchDate;
            params["fields[launch_date][relation]"] = "=";
        }

        return params;
    }

    _isOk(resp) {
        return resp.status === "ok";
    }

    _isError(resp) {
        return resp.status === "error";
    }
}

export default SatelliteFinder;
