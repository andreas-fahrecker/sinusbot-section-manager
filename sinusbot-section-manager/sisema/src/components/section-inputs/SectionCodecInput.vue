<template>
    <b-form-group label="Section Codec" label-for="sectionCodecInput">
        <!--suppress XmlDuplicatedId -->
        <b-form-input v-if="readonly" id="sectionCodecInput" v-model="codecs.filter(codec => codec.value === value)[0].text" type="text" readonly/>
        <!--suppress XmlDuplicatedId -->
        <b-form-select v-else id="sectionCodecInput" :value="value" @input="updateValue($event)" :options="codecs"/>
    </b-form-group>
</template>

<script>
    import {BFormGroup, BFormSelect, BFormInput} from 'bootstrap-vue';

    export default {
        props: {
            value: {type: String},
            readonly: {type: Boolean, default: false}
        },
        name: "SectionCodecInput",
        components: {BFormGroup, BFormSelect, BFormInput},
        data() {
            return {
                codecs: [
                    {value: '0', text: 'Speex Schmalband'},
                    {value: '1', text: 'Speex Breitband'},
                    {value: '2', text: 'Speex Ultra-Breitband'},
                    {value: '3', text: 'CELT Mono'},
                    {value: '4', text: 'Opus Voice'},
                    {value: '5', text: 'Opus Music'}
                ]
            };
        },
        methods: {
            updateValue(value) {
                this.$emit('input', value);
            }
        }
    }
</script>

<style scoped>

</style>