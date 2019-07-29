<template>
    <b-card>
        <b-row slot="header">
            <b-col>
                <h4>New Section</h4>
            </b-col>
        </b-row>
        <b-form>
            <section-parent-channel-input v-model="sectionChannel.parent" :selectedBotInstance="selectedBotInstance"/>
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
        <b-row>
            <b-col>{{sectionChannel.validateSectionChannelName()}}</b-col>
        </b-row>
        <b-row slot="footer">
            <b-col>
                <b-button block @click="createChannelSection">Create Channel Section</b-button>
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
    import SectionChannel from "../model/SectionChannel";
    import SectionPermission from "../model/SectionPermission";

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
                sectionChannel: new SectionChannel('', null, '4', '6', false, [])
            };
        },
        methods: {
            addNewChannelPermission() {
                this.sectionChannel.permissions.push(new SectionPermission('', null));
            },
            removeLastChannelPermission() {
                this.sectionChannel.permissions.pop();
            },
            createChannelSection() {
                axios
                    .post(process.env.VUE_APP_DOMAIN + 'api/v1/bot/i/' + this.selectedBotInstance + '/event/createChannelSection',
                        {channelSection: JSON.stringify(this.sectionChannel)},
                        {headers: {'Authorization': 'bearer ' + window.localStorage.token}}
                    )
                    .then(response => console.log(JSON.stringify(response)));
            }
        }
    }
</script>

<style scoped>

</style>