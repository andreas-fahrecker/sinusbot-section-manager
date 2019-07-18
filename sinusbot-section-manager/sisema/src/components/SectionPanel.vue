<template>
    <b-card title="Sections">
        <b-card-text>
            <bot-instance-selection v-bind:selectedBotInstance="activeInstanceUUID"
                                    v-on:botInstanceSelected="activeInstanceUUID = $event"></bot-instance-selection>
        </b-card-text>
    </b-card>
</template>

<script>
    import BotInstanceSelection from './BotInstanceSelection';

    export default {
        name: "SectionPanel",
        components: {BotInstanceSelection},
        data() {
            return {
                activeInstanceUUID: null
            };
        },
        methods: {}
    }
</script>

<style scoped>

</style>