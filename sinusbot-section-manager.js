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
        },
        {
            name: "MANAGED_SECTIONS",
            title: "Channel Sections",
            type: "array",
            vars: [
                {
                    name: "SECTION_NAME",
                    title: "Section Name (just for reference in logs)",
                    type: "string"
                },
                {
                    name: "SECTION_PARENT_CHANNEL",
                    title: "Section Parent Channel",
                    type: "channel"
                },
                {
                    name: "SECTION_TYPE",
                    title: "Section Type",
                    type: "select",
                    options: ["Normal"],
                    default: 0
                },
                {
                    name: "CHANNEL_PREFIX_ENABLED",
                    title: "Channel Prefix Enabled",
                    type: "checkbox",
                    conditions: [
                        { field: "SECTION_TYPE", value: 0 }
                    ]
                },
                {
                    name: "CHANNEL_PREFIX",
                    title: "Channel Prefix",
                    type: "string",
                    conditions: [
                        { field: "SECTION_TYPE", value: 0 },
                        { field: "CHANNEL_PREFIX_ENABLED", value: true }
                    ]
                },
                {
                    name: "CHANNEL_PREFIX_SPACER",
                    title: "Space between prefix and channel number?",
                    type: "checkbox",
                    conditions: [
                        { field: "SECTION_TYPE", value: 0 },
                        { field: "CHANNEL_PREFIX_ENABLED", value: true }
                    ]
                },
                {
                    name: "CHANNEL_SUFFIX_ENABLED",
                    title: "Channel Suffix Enabled",
                    type: "checkbox",
                    conditions: [
                        { field: "SECTION_TYPE", value: 0 }
                    ]
                },
                {
                    name: "CHANNEL_SUFFIX",
                    title: "Channel Suffix",
                    type: "string",
                    conditions: [
                        { field: "SECTION_TYPE", value: 0 },
                        { field: "CHANNEL_SUFFIX_ENABLED", value: true }
                    ]
                },
                {
                    name: "CHANNEL_SUFFIX_SPACER",
                    title: "Space between suffix and channel number?",
                    type: "checkbox",
                    conditions: [
                        { field: "SECTION_TYPE", value: 0 },
                        { field: "CHANNEL_SUFFIX_ENABLED", value: true }
                    ]
                },
                {
                    name: "SECTION_MIN_CHANNEL_ENABLED",
                    title: "Section Min Channels Enabled (Even if disabled there will be one empty channel)",
                    type: "checkbox"
                },
                {
                    name: "SECTION_MIN_CHANNELS",
                    title: "Section Minimum Channels",
                    type: "number",
                    conditions: [
                        { field: "SECTION_MIN_CHANNEL_ENABLED", value: true }
                    ]
                },
                {
                    name: "SECTION_MAX_CHANNEL_ENABLED",
                    title: "Section Max Channels Enabled",
                    type: "checkbox"
                },
                {
                    name: "SECTION_MAX_CHANNELS",
                    title: "Section Maximum Channels",
                    type: "number",
                    conditions: [
                        { field: "SECTION_MAX_CHANNEL_ENABLED", value: true }
                    ]
                },
                {
                    name: "CHANNEL_CODEC",
                    title: "Channel Codec",
                    type: "select",
                    options: ["Speex Schmalband", "Speex Breitband", "Speex Ultra-Breitband", "CELT Mono", "Opus Voice", "Opus Music"]
                },
                {
                    name: "CHANNEL_CODEC_QUALITY",
                    title: "Channel Quality",
                    type: "select",
                    options: [
                        1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                    ]
                },
                {
                    name: "CHANNEL_PERMISSIONS",
                    title: "Channel Permissions",
                    type: "array",
                    vars: [
                        {
                            name: "PERMISSION_ID",
                            title: "Permission Id",
                            type: "string"
                        },
                        {
                            name: "PERMISSION_VALUE",
                            title: "Permission Value",
                            type: "number"
                        }
                    ]
                }
            ]
        }
    ]
}, (_, { DEBUG_LEVEL, MANAGED_SECTIONS }, { }) => {
    const engine = require('engine');
    const backend = require('backend');
    const event = require('event');

    const LOG_LEVEL = {
        VERBOSE: 3,
        INFO: 2,
        WARNING: 1,
        ERROR: 0
    };

    /**
    * Logs according to log level
    * @param {number}level - loglevel of this message
    * @param {string}message - message to log
    */
    function log(level, message) {
        if (level <= DEBUG_LEVEL)
            engine.log("SSM: " + Object.keys(LOG_LEVEL).filter(log_level => LOG_LEVEL[log_level] === level)[0] + ": " + message);
    }

    const SECTION_TYPES = {
        NORMAL: 0
    };
    const CODECS = {
        Speex_Schmalband: 0,
        Speex_Breitband: 1,
        Speex_UltraBreitband: 2,
        CELT_Mono: 3,
        Opus_Voice: 4,
        Opus_Music: 5
    };

    class ChannelPermission {
        /**
         * 
         * @param {string} id 
         * @param {number} value 
         */
        constructor(
            id,
            value
        ) {
            if (!(typeof id === "string" && typeof value === "number")) throw new Error("Coudn't create ChannelPermissions!");
            this.id = id;
            this.value = value;
        }
    }
    class ChannelSection {
        /**
         * 
         * @param {string} name 
         * @param {string} parent_channel_id 
         * @param {number} type 
         * @param {number|false} min_channels 
         * @param {number|false} max_channels 
         * @param {string|false} channel_prefix 
         * @param {boolean} channel_prefix_spacer 
         * @param {string|false} channel_suffix 
         * @param {boolean} channel_suffix_spacer 
         * @param {number} channel_codec 
         * @param {number} channel_codec_quality 
         * @param {[ChannelPermission]|false} channel_permissions 
         */
        constructor(
            name,
            parent_channel_id,
            type,
            min_channels,
            max_channels,
            channel_prefix,
            channel_prefix_spacer,
            channel_suffix,
            channel_suffix_spacer,
            channel_codec,
            channel_codec_quality,
            channel_permissions) {
            if (
                !(
                    typeof name === "string" &&
                    typeof parent_channel_id === "string" &&
                    typeof type === "number" &&
                    (typeof min_channels === "number" || min_channels === false) &&
                    (typeof max_channels === "number" || max_channels === false) &&
                    (typeof channel_prefix === "string" || channel_prefix === false) &&
                    typeof channel_prefix_spacer === "boolean" &&
                    (typeof channel_suffix === "string" || channel_suffix === false) &&
                    typeof channel_suffix_spacer === "boolean" &&
                    typeof channel_codec === "number" &&
                    typeof channel_codec_quality === "number" &&
                    (Array.isArray(channel_permissions) || channel_permissions === false)
                )
            ) throw new Error("Couldn't create ChannelSection!");
            if (name === "") throw new Error("Name of Channel Section cannot be an empty string.");
            if (!backend.getChannelByID(parent_channel_id)) throw new Error("Channel Section Parent doesn't exist.");
            if (!Object.values(SECTION_TYPES).includes(type)) throw new Error("Channel Section Type doesn't exists");
            if (min_channels)
                if (!(min_channels > 0)) throw new Error("Channel Section Min Channel has to be greater than 0.");
            if (max_channels)
                if (!(max_channels > 0)) throw new Error("Channel Section Max Channel has to be greater than 0.");
            if (min_channels && max_channels)
                if (!(max_channels > min_channels)) throw new Error("Channel Section Max Channels has to be greater than Channel Section Min Channels.");
            if (!Object.values(CODECS).includes(channel_codec)) throw new Error("Channel Codec doesn't exist.");
            if (!(channel_codec_quality > 0 && channel_codec_quality < 11)) throw new Error("Channel Codec Quality is invalid.");
            this.name = name;
            this.parent_channel_id = parent_channel_id;
            this.type = type;
            this.min_channels = min_channels;
            this.max_channels = max_channels;
            this.channel_prefix = channel_prefix;
            this.channel_prefix_spacer = channel_prefix_spacer;
            this.channel_suffix = channel_suffix;
            this.channel_suffix_spacer = channel_suffix_spacer;
            this.channel_codec = channel_codec;
            this.channel_codec_quality = channel_codec_quality;
            this.channel_permissions = channel_permissions;

            this.channels = [];
        }
    }

    /**
    * Returns an Array of all ChannelSection passed in from the Config
    * @param {*} MANAGED_SECTIONS
    * @returns {[ChannelSection]}
    */
    function loadChannelSections(MANAGED_SECTIONS) {
        return MANAGED_SECTIONS.map(section => loadChannelSection(section));
    }
    /**
     * Returns one ChannelSection passed in from the Object in the Configs Array
     * @param {*} MANAGED_SECTION 
     * @returns {ChannelSection}
     */
    function loadChannelSection(MANAGED_SECTION) {
        const type = parseInt(MANAGED_SECTION.SECTION_TYPE, 10);
        const min_channels = MANAGED_SECTION.SECTION_MIN_CHANNEL_ENABLED ?
            MANAGED_SECTION.SECTION_MIN_CHANNELS : false;
        const max_channels = MANAGED_SECTION.SECTION_MAX_CHANNEL_ENABLED ?
            MANAGED_SECTION.SECTION_MAX_CHANNELS : false;
        const channel_prefix = MANAGED_SECTION.CHANNEL_PREFIX_ENABLED ?
            MANAGED_SECTION.CHANNEL_PREFIX : false;
        const channel_prefix_spacer = channel_prefix ?
            MANAGED_SECTION.CHANNEL_PREFIX_ENABLED : false;
        const channel_suffix = MANAGED_SECTION.CHANNEL_SUFFIX_ENABLED ?
            MANAGED_SECTION.CHANNEL_SUFFIX : false;
        const channel_suffix_spacer = channel_suffix ?
            MANAGED_SECTION.CHANNEL_SUFFIX_ENABLED : false;
        const channel_codec = parseInt(MANAGED_SECTION.CHANNEL_CODEC, 10);
        const channel_codec_quality = parseInt(MANAGED_SECTION.CHANNEL_CODEC_QUALITY, 10) + 1;
        const channel_permissions = MANAGED_SECTION.CHANNEL_PERMISSIONS ?
            MANAGED_SECTION.CHANNEL_PERMISSIONS.map(
                channel_permission => new ChannelPermission(channel_permission.PERMISSION_ID, channel_permission.PERMISSION_VALUE)
            ) :
            false;
        return new ChannelSection(
            MANAGED_SECTION.SECTION_NAME,
            MANAGED_SECTION.SECTION_PARENT_CHANNEL,
            type,
            min_channels,
            max_channels,
            channel_prefix,
            channel_prefix_spacer,
            channel_suffix,
            channel_suffix_spacer,
            channel_codec,
            channel_codec_quality,
            channel_permissions
        );
    }
    /**
     * Returns all Channels of a Parent Channel
     * @param {string} parent_channel_id 
     * @returns
     */
    function loadSectionChannels(parent_channel_id) {
        return backend.getChannels().filter(channel => {
            if (!channel.parent()) return false;
            return channel.parent().id() === parent_channel_id;
        });
    }
    function deleteChannel(channels, channel_id) {
        const channels_after_delete = channels.filter(channel => channel.id() !== channel_id);
        channels.filter(channel => channel.id() === channel_id)[0].delete();
        return channels_after_delete;
    }
    /**
     * Returns all Channels which aren't empty after deleting all empty channels.
     * @param {[*]} channels 
     */
    function deleteEmptyChannels(channels) {
        const channels_after_delete = channels.filter(channel => channel.getClientCount() > 0);
        channels.filter(channel => channel.getClientCount() < 1)
            .forEach(channel => channel.delete());
        return channels_after_delete;
    }
    function generateChannelName(number, prefix, prefix_spacer, suffix, suffix_spacer) {
        const channel_prefix = prefix ? prefix : "";
        const channel_prefix_spacer = prefix_spacer ? " " : "";
        const channel_suffix_spacer = suffix_spacer ? " " : "";
        const channel_suffix = suffix ? suffix : "";
        return channel_prefix + channel_prefix_spacer + number + channel_suffix_spacer + channel_suffix;
    }
    function createChannel(
        channels, max_channels,
        name_prefix, name_prefix_spacer, name_suffix, name_suffix_spacer,
        parent_channel_id,
        channel_codec, channel_codec_quality,
        channel_permissions
    ) {
        if (max_channels) if (!(channels.length < max_channels)) return channels;
        const channelParamas = {
            name: generateChannelName(channels.length + 1, name_prefix, name_prefix_spacer, name_suffix, name_suffix_spacer),
            parent: parent_channel_id,
            description: "",
            topic: "",
            password: "",
            codec: channel_codec,
            codecQuality: channel_codec_quality,
            encrypted: true,
            permanent: true,
            semipermanent: false,
            maxClients: -1
        };
        if (backend.getChannels().filter(channel => channel.name() === channelParamas.name).length > 0)
            channelParamas.name = "_" + channelParamas.name;
        const channel = backend.createChannel(channelParamas);
        if (channel_permissions) {
            channel_permissions.forEach(channel_permission => {
                const permission = channel.addPermission(channel_permission.id);
                permission.setValue(channel_permission.value);
                permission.save();
            });
        }
        channels.push(channel);
        return channels;
    }
    function createMissingChannels(
        channels, min_channels, max_channels,
        name_prefix, name_prefix_spacer, name_suffix, name_suffix_spacer,
        parent_channel_id,
        channel_codec, channel_codec_quality,
        channel_permissions
    ) {
        if (!min_channels) return channels;
        if (!(channels.length < min_channels)) return channels;
        while (channels.length < min_channels) {
            channels = createChannel(
                channels, max_channels,
                name_prefix, name_prefix_spacer, name_suffix, name_suffix_spacer,
                parent_channel_id,
                channel_codec, channel_codec_quality,
                channel_permissions
            );
        }
        return channels;
    }
    function hasEmptyChannel(channels) {
        return channels.filter(channel => channel.getClientCount() < 1).length > 0;
    }
    function createEmptyChannel(
        channels, max_channels,
        name_prefix, name_prefix_spacer, name_suffix, name_suffix_spacer,
        parent_channel_id,
        channel_codec, channel_codec_quality,
        channel_permissions
    ) {
        if (hasEmptyChannel(channels)) return channels;
        return createChannel(
            channels, max_channels,
            name_prefix, name_prefix_spacer, name_suffix, name_suffix_spacer,
            parent_channel_id,
            channel_codec, channel_codec_quality,
            channel_permissions
        );
    }
    function renameChannels(
        channels, name_prefix, name_prefix_spacer, name_suffix, name_suffix_spacer
    ) {
        channels.sort((channel_a, channel_b) => channel_a.position() - channel_b.position())
            .forEach((channel, index) => {
                const correct_channel_name = generateChannelName(index + 1, name_prefix, name_prefix_spacer, name_suffix, name_suffix_spacer);
                if (channel.name() !== correct_channel_name) channel.setName(correct_channel_name);
            });
    }

    const channel_sections = loadChannelSections(MANAGED_SECTIONS);

    channel_sections.forEach(section => {
        section.channels = loadSectionChannels(section.parent_channel_id);
        section.channels = deleteEmptyChannels(section.channels);
        section.channels = createMissingChannels(
            section.channels, section.min_channels, section.max_channels,
            section.channel_prefix, section.channel_prefix_spacer, section.channel_suffix, section.channel_suffix_spacer,
            section.parent_channel_id,
            section.channel_codec, section.channel_codec_quality,
            section.channel_permissions
        );
        section.channels = createEmptyChannel(
            section.channels, section.max_channels,
            section.channel_prefix, section.channel_prefix_spacer, section.channel_suffix, section.channel_suffix_spacer,
            section.parent_channel_id,
            section.channel_codec, section.channel_codec_quality,
            section.channel_permissions
        );
        renameChannels(section.channels, section.channel_prefix, section.channel_prefix_spacer, section.channel_suffix, section.channel_suffix_spacer);
    });

    event.on("clientMove", e => {
        if (e.fromChannel) {
            if (e.fromChannel.parent()) {
                channel_sections.filter(section => section.parent_channel_id === e.fromChannel.parent().id())
                    .forEach(section => {
                        if (e.fromChannel.getClientCount() < 1) {
                            section.channels = deleteChannel(section.channels, e.fromChannel.id());
                            section.channels = createMissingChannels(
                                section.channels, section.min_channels, section.max_channels,
                                section.channel_prefix, section.channel_prefix_spacer, section.channel_suffix, section.channel_suffix_spacer,
                                section.parent_channel_id,
                                section.channel_codec, section.channel_codec_quality,
                                section.channel_permissions
                            );
                            section.channels = createEmptyChannel(
                                section.channels, section.max_channels,
                                section.channel_prefix, section.channel_prefix_spacer, section.channel_suffix, section.channel_suffix_spacer,
                                section.parent_channel_id,
                                section.channel_codec, section.channel_codec_quality,
                                section.channel_permissions
                            );
                            renameChannels(section.channels, section.channel_prefix, section.channel_prefix_spacer, section.channel_suffix, section.channel_suffix_spacer);
                        }
                    });
            }
        }
        if (e.toChannel) {
            if (e.toChannel.parent()) {
                channel_sections.filter(section => section.parent_channel_id === e.toChannel.parent().id())
                    .forEach(section => {
                        if (e.toChannel.getClientCount() === 1) {
                            section.channels = createEmptyChannel(
                                section.channels, section.max_channels,
                                section.channel_prefix, section.channel_prefix_spacer, section.channel_suffix, section.channel_suffix_spacer,
                                section.parent_channel_id,
                                section.channel_codec, section.channel_codec_quality,
                                section.channel_permissions
                            );
                            renameChannels(section.channels, section.channel_prefix, section.channel_prefix_spacer, section.channel_suffix, section.channel_suffix_spacer);
                        }
                    });
            }
        }
    });
});