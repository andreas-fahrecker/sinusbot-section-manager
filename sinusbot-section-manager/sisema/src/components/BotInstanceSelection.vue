<template>
    <b-dropdown id="manBotInsDD" text="Managing Bot Instance">
        <b-dropdown-item-button v-for="botInstance in botInstances" :key="botInstance.uuid"
                                :active="selectedBotInstance === botInstance.uuid"
                                @click="botInstanceSelect(botInstance.uuid)">
            {{(botInstance.name ? botInstance.name : botInstance.nick)}}
        </b-dropdown-item-button>
    </b-dropdown>
</template>

<script>
    import axios from 'axios';
    import {BDropdown, BDropdownItemButton} from 'bootstrap-vue';
    import BotInstance from "../model/BotInstance";

    export default {
        props: ['selectedBotInstance'],
        name: "BotInstanceSelection",
        components: {
            BDropdown,
            BDropdownItemButton
        },
        data() {
            return {
                botInstances: null
            };
        },
        methods: {
            botInstanceSelect(instanceUUID) {
                this.$emit('botInstanceSelected', instanceUUID);
            }
        },
        mounted() {
            axios
                .get(process.env.VUE_APP_DOMAIN + 'api/v1/bot/instances', {headers: {'Authorization': 'bearer ' + window.localStorage.token}})
                .then(response => {
                    this.botInstances = response.data.filter(botInstance => botInstance.backend === 'ts3')
                        .map(botInstance => {
                            return new BotInstance(botInstance.uuid, botInstance.name, botInstance.nick);
                        });
                    if (this.botInstances.length === 1) {
                        this.botInstanceSelect(this.botInstances[0].uuid);
                    }
                    console.log('botInstances: ' + JSON.stringify(this.botInstances));
                })
                .finally(() => {
                    if (process.env.NODE_ENV === 'development') {
                        this.botInstances = [
                            {
                                "backend": "ts3",
                                "uuid": "391111aa-9fb7-45fa-91c6-bcb6aee7cc05",
                                "name": "MusicBot",
                                "nick": "MusicBot",
                                "running": true,
                                "playing": false,
                                "mainInstance": false,
                                "licenseId": "",
                                "serverHost": "127.0.0.1",
                                "serverPort": 9987,
                                "privileges": {}
                            },
                            {
                                "backend": "ts3",
                                "uuid": "587d8da8-42d0-4efc-980b-a2ffd3599c5f",
                                "name": "",
                                "nick": "Bot",
                                "running": false,
                                "playing": false,
                                "mainInstance": false,
                                "licenseId": "",
                                "serverHost": "127.0.0.1",
                                "serverPort": 9987,
                                "privileges": {}
                            }
                        ]
                            .filter(botInstance => botInstance.backend === 'ts3')
                            .map(botInstance => {
                                return new BotInstance(botInstance.uuid, botInstance.name, botInstance.nick);
                            });
                    }
                });
        }
    }
</script>

<style scoped>

</style>