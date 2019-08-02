import ChannelSection from "../sinusbot-section-manager/sisema/src/model/ChannelSection";

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

    importScript('sinusbot-section-manager/sisema/src/model/ChannelSection.js');
    importScript('sinusbot-section-manager/sisema/src/model/ChannelPermission.js');

    const storeKeys = {
        channelSections: 'channelSections'
    };

    const engine = require('engine');
    const store = require('store');
    const backend = require('backend');
    const event = require('event');

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

    event.on('api:addOrReplaceChannelSection', ev => {
        const channelSection = ChannelSection.fromJSON(ev.data().channelSection);
        if (!channelSection.validateChannelSection()) return {error: 'ChannelSection is not valid'};
        store.setInstance(storeKeys.channelSections, addOrReplaceChannelSection(store.getInstance(storeKeys.channelSections), channelSection));
        return {channelSections: store.getInstance(storeKeys.channelSections)};
    });

    event.on('api:createChannelSection', ev => {
        let channelSection = ChannelSection.fromJSON(ev.data().channelSection);
        engine.log('Channel Section: ' + channelSection.toJSONString());
        engine.log('Validate Name: ' + channelSection._validateName());
        engine.log('Validate Parent: ' + channelSection._validateParent(backend.getChannels()));
        engine.log('Validate Codec: ' + channelSection._validateCodec());
        engine.log('Validate Codec Quality: ' + channelSection._validateCodecQuality());
        engine.log('Validate Encrypted: ' + channelSection._validateEncrypted());
        engine.log('Validate Permissions: ' + channelSection._validatePermissions());
        engine.log('Validate ChannelSection: ' + channelSection.validateChannelSection(backend.getChannels()));
    });

    event.on('api:getChannelSections', ev => {
        channelSections: getChannelSections()
    });
});