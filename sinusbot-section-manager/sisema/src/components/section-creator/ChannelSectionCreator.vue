<template>
    <div>
        <b-form>
            <b-form-row>
                <b-col>
                    <b-form-group label="Section Parent Channel" label-for="sectionParentInput">
                        <b-form-select id="sectionParentInput" v-model="sectionChannel.parent">
                            <option v-for="tsChannel in tsChannels"
                                    v-bind:key="tsChannel.id"
                                    v-bind:value="tsChannel.id">
                                {{tsChannel.name}}
                            </option>
                        </b-form-select>
                    </b-form-group>
                </b-col>
            </b-form-row>
            <b-form-row>
                <b-col>
                    <b-form-group label="Section Name" label-for="sectionNameInput"
                                  description="A channel number gets added after the name.">
                        <b-form-input id="sectionNameInput" v-model="sectionChannel.name"
                                      placeholder="Enter the name of the section channels"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-form-row>
            <b-form-row>
                <b-col>
                    <b-form-group label="Section Codec" label-for="sectionCodecInput">
                        <b-form-select id="sectionCodecInput" v-model="sectionChannel.codec"
                                       v-bind:options="codecs"></b-form-select>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="Section Codec Quality" label-for="sectionCodecQualityInput"
                                  v-bind:description="'Value: ' + sectionChannel.codecQuality">
                        <b-form-input id="sectionCodecQualityInput" v-model="sectionChannel.codecQuality" type="range"
                                      min="0"
                                      max="10"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-form-row>
            <b-form-row>
                <b-col>
                    <b-form-group label="Voice Encryption" label-for="sectionVoiceEncryptionInput">
                        <b-form-select id="sectionVoiceEncryptionInput" v-model="sectionChannel.encrypted"
                                       v-bind:options="encryptedOptions"></b-form-select>
                    </b-form-group>
                </b-col>
            </b-form-row>
            <b-form-row v-for="(permission, index) in sectionChannel.permissions">
                <b-col>
                    <b-form-group label="Permission Id" v-bind:label-for="'sectionPermissionId' + index + 'Input'">
                        <b-form-input v-bind:id="'sectionPermissionId' + index + 'Input'"
                                      v-model="sectionChannel.permissions[index].permissionId"
                                      type="text"></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="Permission Value"
                                  v-bind:label-for="'sectionPermissionValue' + index + 'Input'">
                        <b-form-input v-bind:id="'sectionPermissionValue' + index + 'Input'"
                                      v-model="sectionChannel.permissions[index].permissionValue"
                                      type="number"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-form-row>
            <b-form-row>
                <b-col>
                    <b-button v-on:click="addNewChannelPermission">Add Channel Permission</b-button>
                </b-col>
            </b-form-row>
        </b-form>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        props: ['selectedBotInstance'],
        name: "ChannelSectionCreator",
        data() {
            return {
                tsChannels: null,
                codecs: [
                    {value: 0, text: 'Speex Schmalband'},
                    {value: 1, text: 'Speex Breitband'},
                    {value: 2, text: 'Speex Ultra-Breitband'},
                    {value: 3, text: 'CELT Mono'},
                    {value: 4, text: 'Opus Voice'},
                    {value: 5, text: 'Opus Music'}
                ],
                encryptedOptions: [
                    {value: false, text: 'False'},
                    {value: true, text: 'True'}
                ],
                sectionChannel: {
                    name: '',
                    parent: null,
                    codec: '4',
                    codecQuality: '6',
                    encrypted: false,
                    permissions: [
                        {
                            permissionId: 'i_channel_needed_modify_power',
                            permissionValue: 70
                        }
                    ]
                }
            };
        },
        methods: {
            addNewChannelPermission() {
                this.sectionChannel.permissions.push({permissionId: '', permissionValue: null});
            }
        },
        mounted() {
            axios
                .get('http://37.120.184.226:8087/api/v1/bot/i/' + this.selectedBotInstance + '/channels',
                    {headers: {'Authorization': 'bearer ' + window.localStorage.token}})
                .then(response => {
                    this.tsChannels = response.data.map(channel => {
                        return {
                            id: channel.id,
                            name: channel.name.replace(/\[[rcl*]spacer([0-9]+)\]/, '')
                        }
                    });
                })
                .finally(() => {
                    this.tsChannels = [
                        {"id": 4597, "name": "Heisl 1"},
                        {"id": 6, "name": "[*spacer0]━"},
                        {"id": 20, "name": "Mod Channel 1"},
                        {"id": 17, "name": "[*spacer2]━"},
                        {"id": 8, "name": "[cspacer2]►►Talking Section◄◄"},
                        {"id": 9, "name": "[*spacer3]━"},
                        {"id": 21, "name": "[cspacer3]►►Community Section◄◄"},
                        {"id": 2801, "name": "HinnigeHeisln"},
                        {"id": 22, "name": "[*spacer4]━"},
                        {"id": 23, "name": "[cspacer3]►►AFK Section◄◄"},
                        {"id": 24, "name": "[*spacer5]━"},
                        {"id": 1, "name": "Entrancehall"},
                        {"id": 15, "name": "[cspacer1]►►Admin Section◄◄"},
                        {"id": 41, "name": "Admin Channel"},
                        {"id": 4786, "name": "Communism Channel 2"},
                        {"id": 28, "name": "GAD"},
                        {"id": 35, "name": "Mod Channel 2"},
                        {"id": 4788, "name": "Talking 1"},
                        {"id": 27, "name": "Cult of Communism - Entrancehall"},
                        {"id": 4778, "name": "Neko Nii 2"},
                        {"id": 25, "name": "AFK"},
                        {"id": 5, "name": "[cspacer0]►Entrancehall◄"},
                        {"id": 7, "name": "[*spacer1]━"},
                        {"id": 4785, "name": "Communism Channel 1"},
                        {"id": 360, "name": "Doki Doki Neko Club - Entrancehall"},
                        {"id": 4751, "name": "Neko Nii 1"}
                    ].map(channel => {
                        return {
                            id: channel.id,
                            name: channel.name.replace(/\[[rcl*]spacer([0-9]+)\]/, '')
                        };
                    });
                });
        }
    }
</script>

<style scoped>

</style>