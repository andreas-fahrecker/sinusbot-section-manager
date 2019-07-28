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
    const storeKeys = {
        channelSections: 'channelSections'
    };

    const engine = require('engine');
    const store = require('store');
    const backend = require('backend');
    const event = require('event');

    function getChannelSections() {
        return store.get(storeKeys.channelSections);
    }

    function getChannelSection(channelParentId) {
        return store.get(storeKeys.channelSections).filter(channelSection => channelSection.parent === channelParentId);
    }

    function saveChannelSection(sectionChannel) {
        let channelSectionUpdated = false;
        let channelSections = getChannelSections();
        for (let i = 0; i < channelSections.length; i++) {
            if (channelSections[i].parent === sectionChannel.parent) {
                channelSections[i] = sectionChannel;
                channelSectionUpdated = true;
            }
        }
        if (!channelSectionUpdated) {
            channelSections.push(sectionChannel);
        }
        store.set(storeKeys.channelSections, channelSections);
    }

    /**
     *
     */
    event.on('api:createChannelSection', ev => {
        engine.log(ev.data().channel);
    });

    event.on('api:getChannelSections', ev => {
        channelSections: getChannelSections()
    });
});