registerPlugin({
    name: 'Sinusbot-Section-Manager',
    version: '0.0.1',
    description: '',
    author: 'Andreas Fahrecker <andreasfahrecker@gmail.com>',
    vars: [
        {
            name: "DEBUG_LEVEL",
            title: "Debug Level (default is INFO)",
            type: "select",
            options: ["ERROR", "WARNING", "INFO", "VERBOSE"],
            default: "2"
        }
    ]
}, (_, {DEBUG_LEVEL}, {version}) => {
    const engine = require('engine');
    const store = require('store');
    const backend = require('backend');
    const event = require('event');
});