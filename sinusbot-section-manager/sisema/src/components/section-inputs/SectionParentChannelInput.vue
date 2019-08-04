<template>
    <b-form-row>
        <b-col>
            <b-form-group label="Section Parent Channel" label-for="sectionParentInput">
                <b-form-input v-if="readonly" id="sectionParentInput" v-model="selectedTsChannelName" type="text"
                              readonly/>
                <b-form-select v-else id="sectionParentInput" :value="value" @input="updateValue($event)"
                               :options="tsChannelOptions"/>
            </b-form-group>
        </b-col>
    </b-form-row>
</template>

<script>
    import axios from 'axios';
    import TsChannel from "../../model/TsChannel";

    export default {
        props: {
            selectedBotInstance: {type: String},
            value: {type: Number},
            readonly: {type: Boolean, default: false}
        },
        name: "SectionParentChannelInput",
        data() {
            return {
                tsChannels: []
            }
        },
        computed: {
            tsChannelOptions() {
                return this.tsChannels.map(tsChannel => {
                    return {value: tsChannel.id, text: tsChannel.name};
                });
            },
            selectedTsChannelName() {
                let tsChannel = this.tsChannels.filter(tsChannel => tsChannel.id === this.value)[0];
                return tsChannel ? tsChannel.name : '';
            }
        },
        watch: {
            selectedBotInstance(newSelectedBotInstance) {
                this.fetchTsChannels(newSelectedBotInstance);
            }
        },
        methods: {
            fetchTsChannels(selectedBotInstance) {
                if (selectedBotInstance) {
                    axios
                        .get(process.env.VUE_APP_DOMAIN + 'api/v1/bot/i/' + selectedBotInstance + '/channels',
                            {headers: {'Authorization': 'bearer ' + window.localStorage.token}})
                        .then(response => {
                            this.tsChannels = response.data.map(channel => {
                                return new TsChannel(channel.id, channel.name.replace(/\[[rcl*]spacer([0-9]+)]/, ''));
                            });
                        }).finally(() => {
                        if (process.env.NODE_ENV === 'development') {
                            this.tsChannels = [
                                {"id": 4597, "name": "Heisl 1"},
                                {"id": 6, "name": "[*spacer0]━"},
                                {"id": 20, "name": "Mod Channel 1"},
                                {"id": 17, "name": "[*spacer2]━"},
                                {"id": 8, "name": "[cspacer2]►►Talking Section◄◄"},
                                {"id": 9, "name": "[*spacer3]━"},
                                {"id": 21, "name": "[cspacer3]►►Community Section◄◄"},
                                {"id": 2801, "name": "HinnigeHeisln"},
                                {"id": 22, "name": "[*spacer4]━"},
                                {"id": 23, "name": "[cspacer3]►►AFK Section◄◄"},
                                {"id": 24, "name": "[*spacer5]━"},
                                {"id": 1, "name": "Entrancehall"},
                                {"id": 15, "name": "[cspacer1]►►Admin Section◄◄"},
                                {"id": 41, "name": "Admin Channel"},
                                {"id": 4786, "name": "Communism Channel 2"},
                                {"id": 28, "name": "GAD"},
                                {"id": 35, "name": "Mod Channel 2"},
                                {"id": 4788, "name": "Talking 1"},
                                {"id": 27, "name": "Cult of Communism - Entrancehall"},
                                {"id": 4778, "name": "Neko Nii 2"},
                                {"id": 25, "name": "AFK"},
                                {"id": 5, "name": "[cspacer0]►Entrancehall◄"},
                                {"id": 7, "name": "[*spacer1]━"},
                                {"id": 4785, "name": "Communism Channel 1"},
                                {"id": 360, "name": "Doki Doki Neko Club - Entrancehall"},
                                {"id": 4751, "name": "Neko Nii 1"}
                            ].map(channel => {
                                return new TsChannel(channel.id, channel.name.replace(/\[[rcl*]spacer([0-9]+)]/, ''));
                            });
                        }
                    });
                }
            },
            updateValue(value) {
                this.$emit('input', value);
            }
        },
        mounted() {
            this.fetchTsChannels(this.selectedBotInstance);
        }
    }
</script>

<style scoped>

</style>