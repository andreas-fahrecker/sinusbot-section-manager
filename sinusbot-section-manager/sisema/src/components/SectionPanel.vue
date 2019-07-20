<template>
    <b-card>
        <b-row slot="header">
            <b-col><h3>Sections</h3></b-col>
            <b-col>
                <bot-instance-selection v-bind:selectedBotInstance="activeInstanceUUID"
                                        v-on:botInstanceSelected="activeInstanceUUID = $event"></bot-instance-selection>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <channel-section-editor></channel-section-editor>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <channel-section-creator v-bind:selectedBotInstance="activeInstanceUUID"></channel-section-creator>
            </b-col>
        </b-row>
    </b-card>
</template>

<script>
    import {BCard, BRow, BCol} from 'bootstrap-vue';
    import BotInstanceSelection from './BotInstanceSelection';
    import ChannelSectionEditor from './ChannelSectionEditor';
    import ChannelSectionCreator from './ChannelSectionCreator';

    export default {
        name: "SectionPanel",
        components: {
            BCard, BRow, BCol,
            BotInstanceSelection,
            ChannelSectionEditor,
            ChannelSectionCreator
        },
        data() {
            return {
                activeInstanceUUID: (window.localStorage.instanceId ? window.localStorage.instanceId : null)
            };
        },
        methods: {}
    }
</script>

<style scoped>

</style>