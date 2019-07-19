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

    /*
    channelPermission = {
        permId: 'string',
        permValue: 'number'
    };
    channelSection = {
        id: 'number',
        sectionChannelParent: 'channelId',
        name: 'string',
        codec: 'number',
        quality: 'number',
        maxClients: 'number',
        enc: '1 = encrypted',
        channelPermissions: [channelPermission]
    };
    */

    function getChannelSections() {
        return store.get(storeKeys.channelSections);
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