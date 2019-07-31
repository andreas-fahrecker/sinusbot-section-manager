<template>
    <b-card>
        <b-row slot="header">
            <b-col><h4>Section Name</h4></b-col>
        </b-row>
        <b-form>
            <section-name-input v-model="channelSection.name" :readonly="viewMode"/>
            <section-audio-quality-input :codec="channelSection.codec" @update-codec="channelSection.codec = $event"
                                         :codec-quality="channelSection.codecQuality"
                                         @update-codec-quality="channelSection.codecQuality = $event"
                                         :readonly="viewMode"/>
            <section-void-encryption-input v-model="channelSection.encrypted" :readonly="viewMode"/>
            <section-permission-input v-for="(permission, index) in channelSection.permissions"
                                      :key="index" v-model="channelSection.permissions[index]"
                                      :readonly="viewMode"/>
        </b-form>
        <b-row v-if="viewMode" slot="footer">
            <b-col>
                <b-button block variant="primary" @click="editOnClick">Edit</b-button>
            </b-col>
        </b-row>
        <b-row v-else slot="footer">
            <b-col>
                <b-button block variant="primary" @click="saveOnClick">Save</b-button>
            </b-col>
            <b-col>
                <b-button block variant="danger" @click="deleteOnClick">Delete</b-button>
            </b-col>
            <b-col>
                <b-button block variant="warning" @click="cancelOnClick">Cancel</b-button>
            </b-col>
        </b-row>
    </b-card>
</template>

<script>
    import SectionNameInput from './section-inputs/SectionNameInput';
    import SectionAudioQualityInput from "./section-inputs/SectionAudioQualityInput";
    import SectionVoidEncryptionInput from './section-inputs/SectionVoiceEncryptionInput';
    import SectionPermissionInput from './section-inputs/SectionPermissionInput';
    import ChannelSection from "../model/ChannelSection";
    import ChannelPermission from "../model/ChannelPermission";

    export default {
        name: "ChannelSectionEditor",
        components: {
            SectionNameInput,
            SectionAudioQualityInput,
            SectionVoidEncryptionInput,
            SectionPermissionInput
        },
        data() {
            return {
                channelSection: new ChannelSection('Talking', 8, 4, 10, true,
                    [
                        new ChannelPermission('i_channel_needed_modify_power', '70'),
                        new ChannelPermission('i_channel_needed_delete_power', '50'),
                        new ChannelPermission('i_channel_needed_permission_modify_power', '70'),
                        new ChannelPermission('i_ft_needed_file_upload_power', '70'),
                        new ChannelPermission('i_ft_needed_file_download_power', '70'),
                        new ChannelPermission('i_ft_needed_file_rename_power', '70'),
                        new ChannelPermission('i_ft_needed_file_browse_power', '70'),
                        new ChannelPermission('i_ft_needed_directory_create_power', '70')
                    ]),
                viewMode: true
            };
        },
        methods: {
            editOnClick() {
                this.viewMode = false;
            },
            saveOnClick() {

            },
            deleteOnClick() {

            },
            cancelOnClick() {
                this.viewMode = true;
            }
        }
    }
</script>

<style scoped>

</style>