import axios from "axios";

const API_ENDPOINT = "/api/";

export async function findSatellites(noradId, launchDate) {
    try {
        const params = {};
        if (noradId) {
            params["fields[norad_id][value]"] = noradId;
            params["fields[norad_id][relation]"] = "=";
        }

        if (launchDate) {
            params["fields[launch_date][value]"] = launchDate;
            params["fields[launch_date][relation]"] = "=";
        }

        const resp = await axios.get(API_ENDPOINT, {
            params,
        });

        if (resp.data.status === "ok") {
            const { result } = resp.data;

            return {
                totalRows: result["total_rows"],
                satellites: result.satellites,
            };
        } else if (resp.data.status === "error") {
            alert(resp.data.message);

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
