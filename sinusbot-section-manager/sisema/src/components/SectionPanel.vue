<template>
    <b-card>
        <b-row slot="header">
            <b-col><h3>Sections</h3></b-col>
            <b-col>
                <bot-instance-selection :selectedBotInstance="activeInstanceUUID"
                                        @botInstanceSelected="activeInstanceUUID = $event"/>
            </b-col>
        </b-row>
        <b-row v-for="channelSection in channelSections" :key="channelSection.parent">
            <b-col>
                <channel-section-editor :channel-section="channelSection"/>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <channel-section-creator :selectedBotInstance="activeInstanceUUID"/>
            </b-col>
        </b-row>
    </b-card>
</template>

<script>
    import axios from 'axios';
    import BotInstanceSelection from './BotInstanceSelection';
    import ChannelSectionEditor from './ChannelSectionEditor';
    import ChannelSectionCreator from './ChannelSectionCreator';
    import ApiEndpointNames from "../ApiEndpointNames";
    import ChannelSection from "../model/ChannelSection";

    export default {
        name: "SectionPanel",
        components: {
            BotInstanceSelection,
            ChannelSectionEditor,
            ChannelSectionCreator
        },
        data() {
            return {
                activeInstanceUUID: (window.localStorage.instanceId ? window.localStorage.instanceId : null),
                channelSections: null
            };
        },
        watch: {
            activeInstanceUUID(newActiveInstanceUUID) {
                this.fetchChannelSections(newActiveInstanceUUID);
            }
        },
        methods: {
            fetchChannelSections(selectedBotInstance) {
                if (selectedBotInstance !== null && selectedBotInstance !== undefined) {
                    axios
                        .post(process.env.VUE_APP_DOMAIN + 'api/v1/bot/i/' + selectedBotInstance + '/event/' + ApiEndpointNames.getChannelSections(),
                            {}, {headers: {'Authorization': 'bearer ' + window.localStorage.token}}
                        )
                        .then(response => {
                            if (!response.data || response.data.length === 0) return;
                            this.channelSections = response.data[0].channelSections.map(channelSectionJSONString => ChannelSection.fromJSON(channelSectionJSONString));
                            console.log(this.channelSections);
                        });
                }
            }
        },
        mounted() {
            this.fetchChannelSections(this.activeInstanceUUID);
        }
    }
</script>

<style scoped>

</style>