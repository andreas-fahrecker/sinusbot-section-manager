import ChannelSection from "./model/ChannelSection";

export default class Helper {
    /**
     * @description Converts an Array of JSONStrings to an Array of ChannelSections
     * @param {string[]}JSONStrings
     * @returns {ChannelSection[]|boolean}
     */
    static convertJSONStringsToChannelSections(JSONStrings) {
        if (JSONStrings === null || JSONStrings === undefined) return false;
        if (!JSONStrings instanceof Array) return false;
        if (!JSONStrings.every(value => typeof value === 'string' || value instanceof String)) return false;
        return JSONStrings.map(value => ChannelSection.fromJSON(value));
    }
}