<template>
    <b-card>
        <b-row slot="header">
            <b-col>
                <h4>New Section</h4>
            </b-col>
        </b-row>
        <b-form>
            <b-form-row>
                <b-col>
                    <b-form-group label="Section Parent Channel" label-for="sectionParentInput">
                        <b-form-select id="sectionParentInput" v-model="sectionChannel.parent">
                            <option v-for="tsChannel in tsChannels"
                                    :key="tsChannel.id"
                                    :value="tsChannel.id">
                                {{tsChannel.name}}
                            </option>
                        </b-form-select>
                    </b-form-group>
                </b-col>
            </b-form-row>
            <section-name-input v-model="sectionChannel.name"/>
            <section-audio-quality-input :codec="sectionChannel.codec" @update-codec="sectionChannel.codec = $event"
                                         :codec-quality="sectionChannel.codecQuality"
                                         @update-codec-quality="sectionChannel.codecQuality = $event"/>
            <section-voice-encryption-input v-model="sectionChannel.encrypted"/>
            <section-permission-input v-for="(permission, index) in sectionChannel.permissions"
                                      :key="index" v-model="sectionChannel.permissions[index]"/>
            <b-form-row>
                <b-col>
                    <b-button block variant="primary" @click="addNewChannelPermission">Add Channel Permission
                    </b-button>
                </b-col>
                <b-col>
                    <b-button block variant="danger" @click="removeLastChannelPermission"
                              :disabled="sectionChannel.permissions.length < 1">Remove Last Channel Permission
                    </b-button>
                </b-col>
            </b-form-row>
        </b-form>
        <b-row>
            <b-col>{{sectionChannel}}</b-col>
        </b-row>
        <b-row slot="footer">
            <b-col>
                <b-button block>Create Channel Section</b-button>
            </b-col>
        </b-row>
    </b-card>
</template>

<script>
    import axios from 'axios';
    import SectionNameInput from './section-inputs/SectionNameInput';
    import SectionAudioQualityInput from "./section-inputs/SectionAudioQualityInput";
    import SectionVoiceEncryptionInput from './section-inputs/SectionVoiceEncryptionInput';
    import SectionPermissionInput from "./section-inputs/SectionPermissionInput";
    import SectionChannel from "../model/SectionChannel";
    import SectionPermission from "../model/SectionPermission";

    export default {
        props: ['selectedBotInstance'],
        name: "ChannelSectionCreator",
        components: {
            SectionNameInput,
            SectionAudioQualityInput,
            SectionVoiceEncryptionInput,
            SectionPermissionInput
        },
        data() {
            return {
                tsChannels: null,
                sectionChannel: new SectionChannel('', null, '4', '6', false, [])
            };
        },
        methods: {
            addNewChannelPermission() {
                this.sectionChannel.permissions.push(new SectionPermission('', null));
            },
            removeLastChannelPermission() {
                this.sectionChannel.permissions.pop();
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
                            name: channel.name.replace(/\[[rcl*]spacer([0-9]+)]/, '')
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
                            name: channel.name.replace(/\[[rcl*]spacer([0-9]+)]/, '')
                        };
                    });
                });
        }
    }
</script>

<style scoped>

</style>