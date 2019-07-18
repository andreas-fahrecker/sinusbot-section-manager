<template>
    <b-card title="Sections">
        <b-card-text>
            <b-dropdown id="manBotInsDD" text="Managing Bot Instance"></b-dropdown>
            {{botInstances}}
        </b-card-text>
    </b-card>
</template>

<script>
    import axios from 'axios';

    export default {
        name: "SectionPanel",
        data() {
            return {
                botInstances: null
            };
        },
        mounted() {
            axios
                .get('http://37.120.184.226:8087/api/v1/bot/instances', {headers: {'Authorization': 'bearer ' + window.localStorage.token}})
                .then(response => {
                    this.botInstances = response
                });
        }
    }
</script>

<style scoped>

</style>