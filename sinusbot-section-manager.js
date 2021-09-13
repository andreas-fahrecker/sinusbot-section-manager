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
                    options: ["Numbered"],
                    default: 0
                },
                {
                    name: "NUMBERED_PREFIX_ENABLED",
                    title: "Number Prefix Enabled",
                    type: "checkbox",
                    conditions: [
                        { field: "SECTION_TYPE", value: 0 }
                    ]
                },
                {
                    name: "NUMBERED_PREFIX",
                    title: "Number Prefix",
                    type: "string",
                    conditions: [
                        { field: "SECTION_TYPE", value: 0 },
                        { field: "NUMBERED_PREFIX_ENABLED", value: true }
                    ]
                },
                {
                    name: "NUMBERED_PREFIX_SPACER",
                    title: "Space between prefix and channel number?",
                    type: "checkbox",
                    conditions: [
                        { field: "SECTION_TYPE", value: 0 },
                        { field: "NUMBERED_PREFIX_ENABLED", value: true }
                    ]
                },
                {
                    name: "NUMBERED_SUFFIX_ENABLED",
                    title: "Number Suffix Enabled",
                    type: "checkbox",
                    conditions: [
                        { field: "SECTION_TYPE", value: 0 }
                    ]
                },
                {
                    name: "NUMBERED_SUFFIX",
                    title: "Number Suffix",
                    type: "string",
                    conditions: [
                        { field: "SECTION_TYPE", value: 0 },
                        { field: "NUMBERED_SUFFIX_ENABLED", value: true }
                    ]
                },
                {
                    name: "NUMBERED_SUFFIX_SPACER",
                    title: "Space between suffix and channel number?",
                    type: "checkbox",
                    conditions: [
                        { field: "SECTION_TYPE", value: 0 },
                        { field: "NUMBERED_SUFFIX_ENABLED", value: true }
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

    function sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }

    const SECTION_TYPES = {
        NUMBERED: 0
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
            this.id = id;
            this.value = value;
        }
    }
    class ChannelSectionSettings {
        /**
        * Returns one ChannelSection passed in from the Object in the Configs Array
        * @param {*} managed_section 
        * @returns {NumberedChannelSectionSettings}
        */
        static loadChannelSectionSettings(managed_section) {
            const type = parseInt(managed_section.SECTION_TYPE, 10);
            const min_channels = managed_section.SECTION_MIN_CHANNEL_ENABLED ?
                managed_section.SECTION_MIN_CHANNELS : false;
            const max_channels = managed_section.SECTION_MAX_CHANNEL_ENABLED ?
                managed_section.SECTION_MAX_CHANNELS : false;
            const channel_codec = parseInt(managed_section.CHANNEL_CODEC, 10);
            const channel_codec_quality = parseInt(managed_section.CHANNEL_CODEC_QUALITY, 10) + 1;
            const channel_permissions = managed_section.CHANNEL_PERMISSIONS ?
                managed_section.CHANNEL_PERMISSIONS.map(
                    channel_permission => new ChannelPermission(channel_permission.PERMISSION_ID, channel_permission.PERMISSION_VALUE)
                ) :
                false;
            if (type === SECTION_TYPES.NUMBERED) {
                const channelPrefixWoSpacer = (managed_section.NUMBERED_PREFIX_ENABLED ?
                    managed_section.NUMBERED_PREFIX : false);
                const channelPrefixSpacer = channelPrefixWoSpacer ?
                    managed_section.NUMBERED_PREFIX_SPACER : false;
                const channelSuffixWoSpacer = managed_section.NUMBERED_SUFFIX_ENABLED ?
                    managed_section.NUMBERED_SUFFIX : false;
                const channelSuffixSpacer = channelSuffixWoSpacer ?
                    managed_section.NUMBERED_SUFFIX_SPACER : false;
                const channelPrefix = (channelPrefixWoSpacer ? channelPrefixWoSpacer : "") + (channelPrefixSpacer ? " " : "");
                const channelSuffix = (channelSuffixSpacer ? " " : "") + (channelSuffixWoSpacer ? channelSuffixWoSpacer : "");
                return new NumberedChannelSectionSettings(
                    managed_section.SECTION_NAME,
                    managed_section.SECTION_PARENT_CHANNEL,
                    min_channels,
                    max_channels,
                    channelPrefix,
                    channelSuffix,
                    channel_codec,
                    channel_codec_quality,
                    channel_permissions
                );
            } else {
                throw new Error("Unsupportet Section Type");
            }
        }

        /**
         * 
         * @param {string} name 
         * @param {string} parent_channel_id 
         * @param {number} type 
         * @param {number|false} min_channels 
         * @param {number|false} max_channels 
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
            channel_codec,
            channel_codec_quality,
            channel_permissions) {
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
            this.channel_codec = channel_codec;
            this.channel_codec_quality = channel_codec_quality;
            this.channel_permissions = channel_permissions;

            this.channels = [];
        }
    }
    class NumberedChannelSectionSettings extends ChannelSectionSettings {
        /**
         * 
         * @param {string} name 
         * @param {string} parent_channel_id 
         * @param {number|false} min_channels 
         * @param {number|false} max_channels 
         * @param {string|false} channelPrefix 
         * @param {string|false} channelSuffix 
         * @param {number} channel_codec 
         * @param {number} channel_codec_quality 
         * @param {[ChannelPermission]|false} channel_permissions 
         */
        constructor(
            name,
            parent_channel_id,
            min_channels,
            max_channels,
            channelPrefix,
            channelSuffix,
            channel_codec,
            channel_codec_quality,
            channel_permissions) {
            super(name, parent_channel_id, SECTION_TYPES.NUMBERED, min_channels, max_channels, channel_codec, channel_codec_quality, channel_permissions);
            this.channelPrefix = channelPrefix;
            this.channelSuffix = channelSuffix;
        }
    }

    class ChannelSection {
        /**
         * 
         * @param {ChannelSectionSettings} channelSettings 
         */
        constructor(channelSettings) {
            this.channelSettings = channelSettings;
            this.managedChannels = new Map();
        }

        initiateSection() {
            throw new Error("Abstract Method Called.");
        }

        handleNewEmptyChannel(channelId) {
            throw new Error("Abstract Method Called.");
        }
    }

    class NumberedChannelSection extends ChannelSection {
        /**
         * 
         * @param {NumberedChannelSectionSettings} channelSettings 
         */
        constructor(channelSettings) {
            super(channelSettings);
            this._emptyChannels = 0;
            this._channelPrefix = channelSettings.channelPrefix;
            this._channelSuffix = channelSettings.channelSuffix;
        }

        initiateSection() {
            //#region Empty Parent Channel
            {
                const channelsToDelete = backend.getChannels().filter(channel => {
                    if (!channel.parent()) return false;
                    return channel.parent().id() === this.channelSettings.parent_channel_id;
                });
                channelsToDelete.forEach(channel => {channel.delete(); sleep(10);});
            }
            //#endregion
            //#region Create Channels
            {
                while (this.managedChannels.size < this.channelSettings.min_channels) {
                    this.createChannel();
                }
            }
            //#endregion 
        }

        handleNewEmptyChannel(channelId) {
            if (this.managedChannels.size - 1 < this.channelSettings.min_channels) {
                this._emptyChannels++;
                log(LOG_LEVEL.VERBOSE, "Increased Empty Channels of Section: " + this.channelSettings.name + " to " + this._emptyChannels);
            } else {
                const delChannelIndex = this.getIntexOfId(channelId);
                const delChannelPos = this.getPosOfId(channelId);
                this.deleteChannel(channelId);
                sleep(100);
                const moveArray = Array.from(this.managedChannels.values()).sort((c1, c2) => this.getIndexOfName(c1.name()) - this.getIndexOfName(c2.name()));
                console.log("channel pos: " + delChannelPos);
                moveArray[moveArray.length - 1].setPosition(delChannelPos);
                moveArray[moveArray.length - 1].setName(this.genNameOfIndex(delChannelIndex));
            }
        }

        handleNewFilledChannel() {
            this._emptyChannels--;
            if (this.managedChannels.size + 1 > this.channelSettings.max_channels) return;
            if (this._emptyChannels > 0) return;
            this.createChannel();
        }

        handleManualDeletedChannel(channelId) {
            const channelIndex = this.getIntexOfId(channelId);
            const channelPos = this.managedChannels.get(channelId).position();
            this.managedChannels.delete(channelId);
            this.createChannelWithIndex(channelIndex, channelPos);
        }

        createChannel() {
            const createIndex = this.managedChannels.size + 1;
            console.log("createIndex: " + createIndex);
            if (createIndex + 1 > this.channelSettings.max_channels) return false;
            const channelId = this.createChannelWithIndex(createIndex);
            if (channelId) this._emptyChannels++;
            return channelId;
        }

        createChannelWithIndex(index, position = false) {
            if (index < 1) return false
            if (index > this.channelSettings.max_channels) return false;
            const channelParams = {
                name: this.genNameOfIndex(index),
                parent: this.channelSettings.parent_channel_id,
                description: "",
                topic: "",
                password: "",
                codec: this.channelSettings.channel_codec,
                codecQuality: this.channelSettings.channel_codec_quality,
                encrypted: true,
                permanent: true,
                semipermanent: false,
                maxClients: -1
            }
            if (position) {
                channelParams.position = position;
            }
            if (backend.getChannels().filter(channel => channel.name() === channelParams.name).length > 0) {
                channelParams.name = channelParams.name + "_Error";
            }
            const channel = backend.createChannel(channelParams);
            sleep(10);
            this.managedChannels.set(channel.id(), channel);
            if (this.channelSettings.channel_permissions) {
                this.channelSettings.channel_permissions.forEach(channel_permission => {
                    const permission = channel.addPermission(channel_permission.id);
                    permission.setValue(channel_permission.value);
                    permission.save();
                });
            }
            return channel.id();
        }

        deleteChannel(channelId) {
            if (!this.managedChannels.has(channelId)) return false;
            this.managedChannels.get(channelId).delete();
            sleep(10);
            return this.managedChannels.delete(channelId);
        }

        genNameOfIndex(index) {
            return this._channelPrefix + index + this._channelSuffix;
        }

        getIndexOfName(name) {
            return parseInt(name.replace(this._channelPrefix, "").replace(this._channelSuffix, ""), 10);
        }

        getIntexOfId(channelId) {
            return this.getIndexOfName(this.managedChannels.get(channelId).name());
        }

        getPosOfId(channelId) {
            return this.managedChannels.get(channelId).position();
        }
    }

    class ChannelSectionManager {
        /**
        * Returns an Array of all ChannelSection passed in from the Config
        * @param {*} MANAGED_SECTIONS
        * @returns {[ChannelSection]}
        */
        static loadChannelSections(managed_sections) {
            return managed_sections.map(section => {
                const channelSettings = ChannelSectionSettings.loadChannelSectionSettings(section);
                if (channelSettings instanceof NumberedChannelSectionSettings) {
                    return new NumberedChannelSection(channelSettings);
                } else {
                    throw new Error("Unsupportet Section Type");
                }
            });
        }
        constructor(managed_sections) {
            const allChannelSections = ChannelSectionManager.loadChannelSections(managed_sections)
            this.channelSections = new Map();
            allChannelSections.forEach(channelSection => {
                this.channelSections.set(channelSection.channelSettings.name, channelSection);
            });
        }

        run() {
            this.channelSections.forEach(channelSection => channelSection.initiateSection());

            event.on("clientMove", e => {
                if (e.fromChannel) {
                    if (e.fromChannel.parent()) {
                        if (e.fromChannel.getClientCount() < 1) {
                            const sectionName = this.getSectionNameFromParent(e.fromChannel.parent().id());
                            if (sectionName) {
                                this.handleNewEmptyChannel(sectionName, e.fromChannel.id());
                            }
                        }
                    }
                }
                if (e.toChannel) {
                    if (e.toChannel.parent()) {
                        if (e.toChannel.getClientCount() === 1) {
                            const sectionName = this.getSectionNameFromParent(e.toChannel.parent().id());
                            if (sectionName) {
                                this.handleNewFilledChannel(sectionName);
                            }
                        }
                    }
                }
            });

            /*
            event.on("channelDelete", e => {
                if (!e.invoker) return;
                if (e.invoker.id() === backend.getBotClientID()) return;
                const sectionName = this.getSectionNameFromParent(e.channel.id());
                if (sectionName) {
                    this.handleManualDeletedChannel(sectionName, e.channel.id());
                }
            });

            event.on("channelCreate", e => {
                if (!e.invoker) return;
                if (e.invoker.id() === backend.getBotClientID()) return;
                const sectionName = this.getSectionNameFromParent(e.channel.id());
                if (sectionName) {
                    e.channel.delete();
                }
            });
            */
        }

        /**
         * Returns the section name for a ChannelParentId, return false if channel is not managed.
         * @param {string} channelParentId 
         * @returns {string|false}
         */
        getSectionNameFromParent(channelParentId) {
            for (let channelSection of this.channelSections.values()) {
                if (channelSection.channelSettings.parent_channel_id === channelParentId) {
                    return channelSection.channelSettings.name;
                }
            }
            return false;
        }

        handleNewEmptyChannel(sectionName, channelId) {
            this.channelSections.get(sectionName).handleNewEmptyChannel(channelId);
        }

        handleNewFilledChannel(sectionName) {
            this.channelSections.get(sectionName).handleNewFilledChannel();
        }

        handleManualDeletedChannel(sectionName, channelId) {
            this.channelSections.get(sectionName).handleManualDeletedChannel(channelId);
        }
    }

    const channelSectionManaer = new ChannelSectionManager(MANAGED_SECTIONS);
    channelSectionManaer.run();

});