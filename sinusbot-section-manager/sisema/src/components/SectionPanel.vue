<template>
    <b-card>
        <b-row slot="header">
            <b-col><h3>Sections</h3></b-col>
            <b-col>
                <bot-instance-selection v-bind:selectedBotInstance="activeInstanceUUID"
                                        v-on:botInstanceSelected="activeInstanceUUID = $event"></bot-instance-selection>
            </b-col>
        </b-row>
        <b-card-text>
            <channel-section-creator v-bind:selectedBotInstance="activeInstanceUUID"></channel-section-creator>
        </b-card-text>
    </b-card>
</template>

<script>
    import BotInstanceSelection from './BotInstanceSelection';
    import ChannelSectionCreator from './section-creator/ChannelSectionCreator';

    export default {
        name: "SectionPanel",
        components: {
            BotInstanceSelection,
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