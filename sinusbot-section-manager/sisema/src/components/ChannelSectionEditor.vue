<template>
    <b-card>
        <b-row slot="header">
            <b-col><h4>Section Name</h4></b-col>
        </b-row>
        <b-form>
            <section-name-input v-model="sectionChannel.name" readonly/>
            <b-form-row>
                <b-col>
                    <section-codec-input v-model="sectionChannel.codec" readonly/>
                </b-col>
                <b-col>
                    <section-codec-quality-input v-model="sectionChannel.codecQuality" readonly/>
                </b-col>
            </b-form-row>
            <b-form-row>
                <b-col>
                    <section-void-encryption-input v-model="sectionChannel.encrypted" readonly/>
                </b-col>
            </b-form-row>
            <section-permission-input v-for="(permission, index) in sectionChannel.permissions"
                                      :key="permission.permissionId"
                                      v-model="sectionChannel.permissions[index]" readonly/>
        </b-form>
        <b-row slot="footer">
            <b-col>Edit Button n Stuff</b-col>
        </b-row>
    </b-card>
</template>

<script>
    import {BCard, BRow, BCol, BForm, BFormRow} from 'bootstrap-vue';
    import SectionNameInput from './section-inputs/SectionNameInput';
    import SectionCodecInput from './section-inputs/SectionCodecInput';
    import SectionCodecQualityInput from './section-inputs/SectionCodecQualityInput';
    import SectionVoidEncryptionInput from './section-inputs/SectionVoiceEncryptionInput';
    import SectionPermissionInput from './section-inputs/SectionPermissionInput';

    export default {
        name: "ChannelSectionEditor",
        components: {
            BCard, BRow, BCol, BForm, BFormRow,
            SectionNameInput,
            SectionCodecInput,
            SectionCodecQualityInput,
            SectionVoidEncryptionInput,
            SectionPermissionInput
        },
        data() {
            return {
                sectionChannel: {
                    name: "Talking",
                    parent: 8,
                    codec: "4",
                    codecQuality: "10",
                    encrypted: true,
                    permissions: [
                        {
                            permissionId: "i_channel_needed_modify_power", permissionValue: "70"
                        },
                        {
                            permissionId: "i_channel_needed_delete_power", permissionValue: "50"
                        },
                        {
                            permissionId: "i_channel_needed_permission_modify_power", permissionValue: "70"
                        },
                        {
                            permissionId: "i_ft_needed_file_upload_power", permissionValue: "70"
                        },
                        {
                            permissionId: "i_ft_needed_file_download_power", permissionValue: "70"
                        },
                        {
                            permissionId: "i_ft_needed_file_rename_power", permissionValue: "70"
                        },
                        {
                            permissionId: "i_ft_needed_file_browse_power", permissionValue: "70"
                        },
                        {
                            permissionId: "i_ft_needed_directory_create_power", permissionValue: "70"
                        }
                    ]
                }
            };
        },
        methods: {}
    }
</script>

<style scoped>

</style>