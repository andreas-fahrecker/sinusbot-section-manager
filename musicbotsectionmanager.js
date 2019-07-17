registerPlugin({
    name: 'Musicbot Section Manager',
    author: 'Andreas Fahrecker <fahrecker.a@gmail.com>',
    description: 'This Script manages the configured Channel Sections',
    version: '1.0',
    vars: [
        {
            name: 'managedSections',
            title: 'Channel Sections',
            type: 'array',
            vars: [
                {
                    name: 'sectionChannel',
                    title: 'Section Channel',
                    type: 'channel'
                },
                {
                    name: 'sectionChannelName',
                    title: 'Section Channel Name (The Channel Number gets added to the Name)',
                    type: 'string'
                },
                {
                    name: 'sectionChannelCodec',
                    tile: 'Section Channel Codec',
                    type: 'select',
                    options: [
                        'Speex Schmalband',
                        'Speex Breitband',
                        'Speex Ultra-Breitband',
                        'CELT Mono',
                        'Opus Voice',
                        'Opus Music'
                    ]
                },
                {
                    name: 'sectionChannelQuality',
                    title: 'Section Channel Quality',
                    type: 'select',
                    options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                },
                {
                    name: 'sectionChannelEncrypted',
                    title: 'Scetion Channel Encrypted',
                    type: 'select',
                    options: [true, false]
                },
                {
                    name: 'sectionChannelPermissions',
                    title: 'Section Channel Permissions',
                    type: 'array',
                    vars: [
                        {
                            name: 'permId',
                            title: 'Permission Id',
                            type: 'string'
                        },
                        {
                            name: 'permValue',
                            title: 'Permission Value',
                            type: 'number'
                        }
                    ]
                }
            ]
        }
    ]
}, function (_, config, meta) {
    var engine = require('engine');
    var backend = require('backend');
    var event = require('event');

    var managedSections = config.managedSections;
    var sections = [];

    if (managedSections === undefined) {
        engine.log('No Sections to Manage - break loading');
        return;
    }

    for (var i = 0; i < managedSections.length; i++) {
        if (managedSections[i].sectionChannel === undefined) {
            engine.log('No Section Channel selected - break loading');
            return;
        }
        if (managedSections[i].sectionChannelName === undefined) {
            engine.log('No Section Channel Name defined - break loading');
            return;
        }
        if (managedSections[i].sectionChannelCodec === undefined) {
            managedSections[i].sectionChannelCodec = 4;
        }
        if (managedSections[i].sectionChannelQuality === undefined) {
            managedSections[i].sectionChannelQuality = 10;
        }
        if (managedSections[i].sectionChannelEncrypted === undefined) {
            managedSections[i].sectionChannelEncrypted = true;
        } else {
            if (managedSections[i].sectionChannelEncrypted === 0) {
                managedSections[i].sectionChannelEncrypted = true;
            } else {
                managedSections[i].sectionChannelEncrypted = false;
            }
        }
    }

    engine.log("Talking Section Manager: Started");

    function updateChannelPermission(channel, id, value) {
        var permission = channel.addPermission(id);
        permission.setValue(value);
        permission.save();
    }

    function deleteChannel(channelId) {
        sections.forEach(function (section) {
            section.forEach(function (channel, index) {
                if (channel.id() === channelId) {
                    engine.log("Delete " + channel.name());
                    channel.delete();
                    section.splice(index, 1);
                }
            });
        });
    }

    function setChannelNames(sectionIndex) {
        for (var i = 0; i < sections[sectionIndex].length; i++) {
            var newChannelName = managedSections[sectionIndex].sectionChannelName + " " + (i + 1);
            if (sections[sectionIndex][i].name() !== newChannelName) {
                engine.log("Rename " + sections[sectionIndex][i].name() + " to " + newChannelName);
                sections[sectionIndex][i].setName(newChannelName);
            }
        }
    }

    function createNewEmptyChannel(sectionIndex) {
        var emptyChannelCount = 0;
        sections[sectionIndex].forEach(function (channel) {
            var clientCount = channel.getClientCount();
            if (clientCount < 1) {
                emptyChannelCount++;
            }
        });
        if (emptyChannelCount < 1) {
            var channelName = managedSections[sectionIndex].sectionChannelName + " " + (sections[sectionIndex].length + 1);
            engine.log("Create " + channelName);
            sections[sectionIndex].push(backend.createChannel({
                name: channelName,
                parent: managedSections[sectionIndex].sectionChannel,
                codec: managedSections[sectionIndex].sectionChannelCodec,
                codecQuality: managedSections[sectionIndex].sectionChannelQuality,
                encrypted: managedSections[sectionIndex].sectionChannelEncrypted,
                permanent: true,
                maxClients: -1
            }));
            managedSections[sectionIndex].sectionChannelPermissions.forEach(function (permission) {
                updateChannelPermission(
                    sections[sectionIndex][sections[sectionIndex].length - 1],
                    permission.permId,
                    permission.permValue
                );
            });
        }
    }

    var allChannels = backend.getChannels();

    managedSections.forEach(function (managedSection) {
        var section = [];
        allChannels.forEach(function (channel) {
            if (channel.parent()) {
                if (channel.parent().id() === managedSection.sectionChannel) {
                    section.push(channel);
                }
            }
        });
        sections.push(section);
    });

    sections.forEach(function (section, index) {
        for (var i = 0; i < section.length; i++) {
            var clientCount = section[i].getClientCount();
            if (clientCount < 1) {
                engine.log("Delete" + section[i].name() + " with " + clientCount + " Clients");
                section[i].delete();
                section.splice(i, 1);
                i--;
            } else {
                engine.log("Keep " + section[i].name() + " with " + clientCount + " Clients");
            }
        }

        setChannelNames(index);
        createNewEmptyChannel(index);
    });

    event.on('clientMove', function (e) {
        sections.forEach(function (section, index) {
            section.forEach(function (channel) {
                if (e.fromChannel) {
                    if (channel.id() === e.fromChannel.id()) {
                        var clientCountFromChannel = e.fromChannel.getClientCount();
                        if (clientCountFromChannel < 1) {
                            deleteChannel(channel.id());
                            setChannelNames(index);
                            createNewEmptyChannel(index);
                        }
                    }
                }
                if (e.toChannel) {
                    if (channel.id() === e.toChannel.id()) {
                        var clientCountToChannel = e.toChannel.getClientCount();
                        if (clientCountToChannel === 1) {
                            createNewEmptyChannel(index);
                        }
                    }
                }
            });
        });
    });
});