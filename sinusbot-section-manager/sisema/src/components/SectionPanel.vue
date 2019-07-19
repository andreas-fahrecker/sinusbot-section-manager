<template>
    <b-card title="Sections">
        <b-card-text>
            <bot-instance-selection v-bind:selectedBotInstance="activeInstanceUUID"
                                    v-on:botInstanceSelected="activeInstanceUUID = $event"></bot-instance-selection>
            <channel-section-creator v-bind:selectedBotInstance="activeInstanceUUID"></channel-section-creator>
        </b-card-text>
    </b-card>
</template>

<script>
    import BotInstanceSelection from './BotInstanceSelection';
    import ChannelSectionCreator from './ChannelSectionCreator';

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