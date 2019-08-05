import {importClass, importObject} from "../transpiler/SinusbotScriptFunctions";
import ChannelSection from "../sinusbot-section-manager/sisema/src/model/ChannelSection";
import ChannelPermission from "../sinusbot-section-manager/sisema/src/model/ChannelPermission";
import ApiEndpointNames from "../sinusbot-section-manager/sisema/src/ApiEndpointNames";
import ApiEndpointErrors from "../sinusbot-section-manager/sisema/src/ApiEndpointErrors";
import ChannelSectionHelper from "./ChannelSectionHelper";

registerPlugin({
    name: 'Sinusbot-Section-Manager',
    author: 'Andreas Fahrecker <andreasfahrecker@gmail.com>',
    description: 'This Script manages the configured Channel Sections',
    version: '1.0',
    backends: ['ts3'],
    enableWeb: true,
    //engine: ,
    requiredModules: ['http'],
    vars: []
}, function (_, config, meta) {
    importClass('sinusbot-section-manager/sisema/src/model/ChannelSection.js');
    importClass('sinusbot-section-manager/sisema/src/model/ChannelPermission.js');

    importObject('sinusbot-section-manager/sisema/src/ApiEndpointNames.js');
    importObject('sinusbot-section-manager/sisema/src/ApiEndpointErrors.js');

    importClass('src/ChannelSectionHelper.js');

    function getChannelSectionsAsJSONString(channelSections) {
        return channelSections.map(channelSection => JSON.stringify(channelSection));
    }

    function getChannelSection(channelSections, channelParentId) {
        return channelSections.filter(channelSection => channelSection.parent === channelParentId);
    }

    function addOrReplaceChannelSection(channelSections, channelSection) {
        if (channelSections === null || channelSections === undefined) channelSections = [];
        let channelSectionReplaced = false;
        for (let i = 0; i < channelSections.length && !channelSectionReplaced; i++) {
            if (channelSections[i].parent === channelSection.parent) {
                channelSections[i] = channelSection;
                channelSectionReplaced = true;
            }
        }
        if (!channelSectionReplaced) {
            channelSections.push(channelSection);
        }
        return channelSections;
    }

    const helperStrings = {
        gotCalledMsg: ' API Endpoint got called'
    };
    const storeKeys = {
        channelSections: 'channelSections'
    };

    const engine = require('engine');
    const store = require('store');
    const backend = require('backend');
    const event = require('event');

    //+++++++++++++++ Init Values +++++++++++++++
    {
        let channelSections = store.getInstance(storeKeys.channelSections);
        if (channelSections === null || channelSections === undefined) {
            channelSections = [];
            store.setInstance(storeKeys.channelSections, channelSections);
            engine.log('ChannelSections was undefined and got set to: ' + JSON.stringify(channelSections));
        }
    }
    //--------------- Init Values ---------------

    event.on('api:' + ApiEndpointNames.createChannelSection, ev => {
        engine.log(ApiEndpointNames.createChannelSection + helperStrings.gotCalledMsg);
        if (ev.data().channelSection === null || ev.data().channelSection === undefined) {
            engine.log(ApiEndpointErrors.noChannelSectionProvided.msg);
            return {error: ApiEndpointErrors.noChannelSectionProvided};
        }
        const channelSection = ChannelSection.fromJSON(ev.data().channelSection);
        if (!channelSection.validateChannelSection(backend.getChannels())) {
            engine.log(ApiEndpointErrors.channelSectionNotValid.msg);
            return {error: ApiEndpointErrors.channelSectionNotValid};
        }
        const channelSections = ChannelSectionHelper.addChannelSection(store.getInstance(storeKeys.channelSections), channelSection);
        // store.setInstance(storeKeys.channelSections, channelSections);
        engine.log(channelSections);
        const channelSectionsAsJSON = ChannelSectionHelper.convertChannelSectionsToJSONStrings(channelSections);
        if (channelSectionsAsJSON === false) {
            engine.log(ApiEndpointErrors.internalError.msg);
            return {error: ApiEndpointErrors.internalError};
        }
        return {channelSections: channelSectionsAsJSON};
    });

    event.on('api:' + ApiEndpointNames.getChannelSections, ev => {
        engine.log(ApiEndpointNames.getChannelSections + helperStrings.gotCalledMsg);
        return {channelSections: getChannelSectionsAsJSONString(store.getInstance(storeKeys.channelSections))};
    });

    event.on('api:' + ApiEndpointNames.getChannelSection, ev => {
        const channelSectionParentId = ev.data().channelSectionParentId;
        engine.log(ApiEndpointNames.getChannelSection + helperStrings.gotCalledMsg + ', requested channelSectionParentId: ' + channelSectionParentId);
        return {channelSection: getChannelSection(store.getInstance(storeKeys.channelSections), channelSectionParentId)};
    });

    event.on('api:' + ApiEndpointNames.addOrReplaceChannelSection, ev => {
        const channelSection = ChannelSection.fromJSON(ev.data().channelSection);
        engine.log(ApiEndpointNames.addOrReplaceChannelSection + helperStrings.gotCalledMsg + ', channelSection: ' + channelSection.toJSONString());
        if (!channelSection.validateChannelSection(backend.getChannels())) return {error: ApiEndpointErrors.channelSectionNotValid};
        // store.setInstance(storeKeys.channelSections, addOrReplaceChannelSection(store.getInstance(storeKeys.channelSections), channelSection));
        // return {channelSections: store.getInstance(storeKeys.channelSections)};
        return {channelSections: addOrReplaceChannelSection(store.getInstance(storeKeys.channelSections), channelSection)};
    });
});