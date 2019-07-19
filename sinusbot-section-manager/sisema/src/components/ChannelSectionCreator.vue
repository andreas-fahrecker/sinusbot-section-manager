<template>
    <div>
        <b-form>
            <b-form-select v-model="selectedSectionParent">
                <option v-for="tsChannel in tsChannels"
                        v-bind:value="tsChannel.id">{{tsChannel.name}}
                </option>
            </b-form-select>
            <b-form-input v-model="sectionName" placeholder="Enter the name of the section channels"></b-form-input>
            <b-form-select v-model="selectedSectionCodec" v-bind:options="codecs"></b-form-select>
            <b-form-input v-model="selectedSectionCodecQuality" type="range" min="0" max="10"></b-form-input>
            <b-form-select v-model="selectedSectionEncryption" v-bind:options="encryptedOptions"></b-form-select>
        </b-form>
        {{tsChannels}}
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        props: ['selectedBotInstance'],
        name: "ChannelSectionCreator",
        data() {
            return {
                tsChannels: null,
                selectedSectionParent: null,
                sectionName: null,
                codecs: [
                    {value: 0, text: 'Speex Schmalband'},
                    {value: 1, text: 'Speex Breitband'},
                    {value: 2, text: 'Speex Ultra-Breitband'},
                    {value: 3, text: 'CELT Mono'},
                    {value: 4, text: 'Opus Voice'},
                    {value: 5, text: 'Opus Music'}
                ],
                selectedSectionCodec: null,
                selectedSectionCodecQuality: '6',
                encryptedOptions: [
                    {value: false, text: 'False'},
                    {value: true, text: 'True'}
                ],
                selectedSectionEncryption: null
            };
        },
        methods: {},
        mounted() {
            axios
                .get('http://37.120.184.226:8087/api/v1/bot/i/' + this.selectedBotInstance + '/channels',
                    {headers: {'Authorization': 'bearer ' + window.localStorage.token}})
                .then(response => {
                    this.tsChannels = response.data.map(channel => {
                        return {
                            id: channel.id,
                            name: channel.name
                        }
                    });
                })
                .finally(() => {
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
                    ];
                });
        }
    }
</script>

<style scoped>

</style>