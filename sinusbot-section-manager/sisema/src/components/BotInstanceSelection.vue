<template>
    <b-dropdown id="manBotInsDD" text="Managing Bot Instance">
        <b-dropdown-item v-for="botInstance in botInstances"
                         v-bind:active="selectedBotInstance === botInstance.uuid"
                         v-on:click="botInsOnClick(botInstance.uuid)">
            {{(botInstance.name ? botInstance.name : botInstance.nick)}}
        </b-dropdown-item>
    </b-dropdown>
</template>

<script>
    import axios from 'axios';

    export default {
        props: ['selectedBotInstance'],
        name: "BotInstanceSelection",
        data() {
            return {
                botInstances: null
            };
        },
        methods: {
            botInsOnClick(instanceUUID) {
                this.$emit('botInstanceSelected', instanceUUID);
            }
        },
        mounted() {
            axios
                .get('http://37.120.184.226:8087/api/v1/bot/instances', {headers: {'Authorization': 'bearer ' + window.localStorage.token}})
                .then(response => {
                    this.botInstances = response.data.filter(botInstance => botInstance.backend === 'ts3')
                        .map(botInstance => {
                            return {
                                uuid: botInstance.uuid,
                                name: botInstance.name,
                                nick: botInstance.nick
                            };
                        });
                })
                .finally(() => {
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
                    ].filter(botInstance => botInstance.backend === 'ts3')
                        .map(botInstance => {
                            return {
                                uuid: botInstance.uuid,
                                name: botInstance.name,
                                nick: botInstance.nick
                            };
                        });
                });
        }
    }
</script>

<style scoped>

</style>