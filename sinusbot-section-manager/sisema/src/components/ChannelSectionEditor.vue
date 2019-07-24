<template>
    <b-card>
        <b-row slot="header">
            <b-col><h4>Section Name</h4></b-col>
        </b-row>
        <b-form>
            <section-name-input v-model="sectionChannel.name" readonly/>
            <section-audio-quality-input :codec="sectionChannel.codec" @update-codec="sectionChannel.codec = $event"
                                         :codec-quality="sectionChannel.codecQuality"
                                         @update-codec-quality="sectionChannel.codecQuality = $event" readonly/>
            <section-void-encryption-input v-model="sectionChannel.encrypted" readonly/>
            <section-permission-input v-for="(permission, index) in sectionChannel.permissions"
                                      :key="index" v-model="sectionChannel.permissions[index]"
                                      readonly/>
        </b-form>
        <b-row slot="footer">
            <b-col>Edit Button n Stuff</b-col>
        </b-row>
    </b-card>
</template>

<script>
    import SectionNameInput from './section-inputs/SectionNameInput';
    import SectionAudioQualityInput from "./section-inputs/SectionAudioQualityInput";
    import SectionVoidEncryptionInput from './section-inputs/SectionVoiceEncryptionInput';
    import SectionPermissionInput from './section-inputs/SectionPermissionInput';
    import SectionChannel from "../model/SectionChannel";
    import SectionPermission from "../model/SectionPermission";

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
                sectionChannel: new SectionChannel('Talking', 8, '4', '10', true,
                    [
                        new SectionPermission('i_channel_needed_modify_power', '70'),
                        new SectionPermission('i_channel_needed_delete_power', '50'),
                        new SectionPermission('i_channel_needed_permission_modify_power', '70'),
                        new SectionPermission('i_ft_needed_file_upload_power', '70'),
                        new SectionPermission('i_ft_needed_file_download_power', '70'),
                        new SectionPermission('i_ft_needed_file_rename_power', '70'),
                        new SectionPermission('i_ft_needed_file_browse_power', '70'),
                        new SectionPermission('i_ft_needed_directory_create_power', '70')
                    ])
            };
        },
        methods: {}
    }
</script>

<style scoped>

</style>