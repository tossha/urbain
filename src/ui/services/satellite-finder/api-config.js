export const FieldType = {
    Number: "Number",
    String: "String",
    Date: "Date",
};

/**
 * @readonly
 * @enum {string}
 */
export const NumberFieldRelationType = {
    GreaterThan: ">",
    LessThan: "<",
    Equal: "=",
};

NumberFieldRelationType.allValues = Object.values(NumberFieldRelationType);

/**
 * @readonly
 * @enum {string}
 */
export const DateFieldRelationType = {
    GreaterThan: ">",
    LessThan: "<",
    Equal: "=",
};

DateFieldRelationType.allValues = Object.values(DateFieldRelationType);

/**
 * @readonly
 * @enum {string}
 */
export const StringFieldRelationType = {
    Equal: "=",
    Like: "like",
};

StringFieldRelationType.allValues = Object.values(StringFieldRelationType);

/**
 * @readonly
 * @enum {string}
 */
export const ServerFieldName = {
    name: "name",
    noradId: "norad_id",
    launchDate: "launch_date",

    // TODO: Uncomment lines below in final version
    // intlDes: "intl_des",
    // objectType: "object_type",
    // country: "country",
    // decayDate: "decay_date",
    // launchSite: "launch_site",
    // period: "period",
    // inc: "inc",
    // apogee: "apogee",
    // perigee: "perigee",
    // launchYear: "launch_year",
    // launchNum: "launch_num",
    // launchPiece: "launch_piece",
    // objectName: "object_name",
    // objectId: "object_id",
    // objectNumber: "object_number",
};

ServerFieldName.allValues = Object.values(ServerFieldName);
ServerFieldName.allKeys = Object.keys(ServerFieldName);

export const SERVER_FIELDS_TYPE = new Map([
    [ServerFieldName.noradId, { type: FieldType.Number }],
    [ServerFieldName.objectType, { type: FieldType.Number }],
    [ServerFieldName.intlDes, { type: FieldType.String }],
    [ServerFieldName.name, { type: FieldType.String }],
    [ServerFieldName.country, { type: FieldType.String }],
    [ServerFieldName.launchDate, { type: FieldType.Date }],
    [ServerFieldName.decayDate, { type: FieldType.Date }],
    [ServerFieldName.launchSite, { type: FieldType.String }],
    [ServerFieldName.period, { type: FieldType.Number }],
    [ServerFieldName.inc, { type: FieldType.Number }],
    [ServerFieldName.apogee, { type: FieldType.Number }],
    [ServerFieldName.launchYear, { type: FieldType.Number }],
    [ServerFieldName.launchNum, { type: FieldType.Number }],
    [ServerFieldName.launchPiece, { type: FieldType.String }],
    [ServerFieldName.objectName, { type: FieldType.String }],
    [ServerFieldName.objectId, { type: FieldType.String }],
    [ServerFieldName.objectNumber, { type: FieldType.Number }],
]);

export class FieldParameter {
    static AllFields = SERVER_FIELDS_TYPE;

    /**
     * @param {ServerFieldName} fieldName
     */
    constructor(fieldName) {
        this._fieldName = fieldName;
    }

    get fieldName() {
        return this._fieldName;
    }
    get fieldType() {
        const { type } = FieldParameter.AllFields.get(this._fieldName);

        return type;
    }

    get relations() {
        const { type } = FieldParameter.AllFields.get(this._fieldName);

        switch (type) {
            case FieldType.Number: {
                return NumberFieldRelationType.allValues;
            }
            case FieldType.String: {
                return StringFieldRelationType.allValues;
            }
            case FieldType.Date: {
                return DateFieldRelationType.allValues;
            }
            default:
                return [];
        }
    }
}
