import ChannelSection from "../sinusbot-section-manager/sisema/src/model/ChannelSection";

export default class ChannelSectionHelper {
    /**
     * @description Converts an Array of ChannelSections to an Array of JSONStrings
     * @param {ChannelSection[]}channelSections
     * @returns {string[]|boolean}
     */
    static convertChannelSectionsToJSONStrings(channelSections) {
        if (channelSections === null || channelSections === undefined) return false;
        if (!channelSections instanceof Array) return false;
        if (!channelSections.every(value => value instanceof ChannelSection)) return false;
        return channelSections.map(value => JSON.stringify(value));
    }

    /**
     * @description Adds a ChannelSection to an array of ChannelSections.
     * Returns false if there is already one with the same parent.
     * @param {ChannelSection[]} channelSections
     * @param {ChannelSection|} channelSection
     * @returns {ChannelSection[]|boolean}
     */
    static addChannelSection(channelSections, channelSection) {
        if (channelSections === null || channelSections === undefined) channelSections = [];
        if (channelSections.filter(value => value.parent === channelSection.parent).length > 0) return false;
        channelSections.push(channelSection);
        return channelSections;
    }
}