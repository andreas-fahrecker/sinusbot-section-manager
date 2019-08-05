<template>
    <b-card>
        <b-row slot="header">
            <b-col>
                <h4>New Section</h4>
            </b-col>
        </b-row>
        <b-form>
            <section-parent-channel-input v-model="channelSection.parent" :selectedBotInstance="selectedBotInstance"/>
            <section-name-input v-model="channelSection.name"/>
            <section-audio-quality-input :codec="channelSection.codec" @update-codec="channelSection.codec = $event"
                                         :codec-quality="channelSection.codecQuality"
                                         @update-codec-quality="channelSection.codecQuality = $event"/>
            <section-voice-encryption-input v-model="channelSection.encrypted"/>
            <section-permission-input v-for="(permission, index) in channelSection.permissions"
                                      :key="index" v-model="channelSection.permissions[index]"/>
            <b-form-row>
                <b-col>
                    <b-button block variant="primary" @click="addNewChannelPermission">Add Channel Permission
                    </b-button>
                </b-col>
                <b-col>
                    <b-button block variant="danger" @click="removeLastChannelPermission"
                              :disabled="channelSection.permissions.length < 1">Remove Last Channel Permission
                    </b-button>
                </b-col>
            </b-form-row>
        </b-form>
        <b-row>
            <b-col>{{channelSection}}</b-col>
        </b-row>
        <b-row slot="footer">
            <b-col>
                <b-button block @click="createChannelSection(selectedBotInstance)">Create Channel Section</b-button>
            </b-col>
        </b-row>
    </b-card>
</template>

<script>
    import axios from 'axios';
    import SectionParentChannelInput from "./section-inputs/SectionParentChannelInput";
    import SectionNameInput from './section-inputs/SectionNameInput';
    import SectionAudioQualityInput from "./section-inputs/SectionAudioQualityInput";
    import SectionVoiceEncryptionInput from './section-inputs/SectionVoiceEncryptionInput';
    import SectionPermissionInput from "./section-inputs/SectionPermissionInput";
    import ChannelSection from "../model/ChannelSection";
    import ChannelPermission from "../model/ChannelPermission";
    import Helper from "../Helper";
    import ApiEndpointNames from "../ApiEndpointNames";

    export default {
        props: ['selectedBotInstance'],
        name: "ChannelSectionCreator",
        components: {
            SectionParentChannelInput,
            SectionNameInput,
            SectionAudioQualityInput,
            SectionVoiceEncryptionInput,
            SectionPermissionInput
        },
        data() {
            return {
                channelSection: new ChannelSection('', null, 4, 6, false, [])
            };
        },
        methods: {
            addNewChannelPermission() {
                this.channelSection.permissions.push(new ChannelPermission('', null));
            },
            removeLastChannelPermission() {
                this.channelSection.permissions.pop();
            },
            createChannelSection(selectedBotInstance) {
                axios
                    .post(process.env.VUE_APP_DOMAIN + 'api/v1/bot/i/' + selectedBotInstance + '/event/' + ApiEndpointNames.createChannelSection,
                        {channelSection: JSON.stringify(this.channelSection)},
                        {headers: {'Authorization': 'bearer ' + window.localStorage.token}}
                    )
                    .then(response => {
                        if (response.data[0].error) {
                            console.log('A error occurred during creating a new ChannelSection: ' + JSON.stringify(response.data[0].error));
                            return;
                        }
                        const channelSections = Helper.convertJSONStringsToChannelSections(response.data[0].channelSections);
                        if (channelSections === false) {
                            console.log('Some unexpected error occurred.');
                            return;
                        }
                        this.$emit('createdChannelSection', channelSections);
                    });
            }
        }
    }
</script>

<style scoped>

</style>