import SearchApiParamsBuilder from "../search-api-params-builder";
import { NumberFieldRelationType, ServerFieldName } from "../api-config";

// fields[norad_id][value]=42850&fields[norad_id][relation]=%3E&
// fields[launch_date][value]=2017-07-14&fields[launch_date][relation]=%3D&order=period&limit=5

describe("SearchApiParamsBuilder", () => {
    it("should build params with value correctly", () => {
        const expectedResult = {
            "fields[norad_id][value]": "42850",
        };
        const paramsBuilder = new SearchApiParamsBuilder();

        paramsBuilder.addWithValue(ServerFieldName.noradId, "42850");
        const params = paramsBuilder.build();

        expect(params).toEqual(expectedResult);
    });

    it("should build params with relation correctly", () => {
        const expectedResult = {
            "fields[norad_id][value]": "42850",
            "fields[norad_id][relation]": ">",
        };
        const paramsBuilder = new SearchApiParamsBuilder();

        paramsBuilder.addWithRelation(ServerFieldName.noradId, NumberFieldRelationType.GreaterThan, "42850");
        const params = paramsBuilder.build();

        expect(params).toEqual(expectedResult);
    });

    it("should build launch_date params with relation correctly", () => {
        const expectedResult = {
            "fields[launch_date][value]": "2017-07-14",
            "fields[launch_date][relation]": "=",
        };
        const paramsBuilder = new SearchApiParamsBuilder();

        paramsBuilder.addWithRelation(ServerFieldName.launchDate, NumberFieldRelationType.Equal, "2017-07-14");
        const params = paramsBuilder.build();

        expect(params).toEqual(expectedResult);
    });

    it("should build norad_id and launch_date params with relation and order correctly", () => {
        const expectedResult = {
            "fields[norad_id][value]": "42850",
            "fields[norad_id][relation]": ">",
            "fields[launch_date][value]": "2017-07-14",
            "fields[launch_date][relation]": "=",
            order: "norad_id",
        };
        const paramsBuilder = new SearchApiParamsBuilder();

        paramsBuilder.addWithRelation(ServerFieldName.noradId, NumberFieldRelationType.GreaterThan, "42850");
        paramsBuilder.addWithRelation(ServerFieldName.launchDate, NumberFieldRelationType.Equal, "2017-07-14");
        paramsBuilder.orderBy(ServerFieldName.noradId);
        const params = paramsBuilder.build();

        expect(params).toEqual(expectedResult);
    });

    it("should build norad_id and launch_date params with relation and limit 5 correctly", () => {
        const expectedResult = {
            "fields[norad_id][value]": "42850",
            "fields[norad_id][relation]": ">",
            limit: 5,
        };
        const paramsBuilder = new SearchApiParamsBuilder();

        paramsBuilder.addWithRelation(ServerFieldName.noradId, NumberFieldRelationType.GreaterThan, "42850");
        paramsBuilder.limit(5);
        const params = paramsBuilder.build();

        expect(params).toEqual(expectedResult);
    });
});
