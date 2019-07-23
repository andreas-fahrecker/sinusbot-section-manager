<template>
    <b-form-row>
        <b-col>
            <b-form-group label="Voice Encryption" label-for="sectionVoiceEncryptionInput">
                <!--suppress XmlDuplicatedId -->
                <b-form-input v-if="readonly" id="sectionVoiceEncryptionInput"
                              v-model="encryptedOptions.filter(option => option.value === value)[0].text"
                              type="text" readonly/>
                <!--suppress XmlDuplicatedId -->
                <b-form-select v-else id="sectionVoiceEncryptionInput" :value="value" @input="updateValue($event)"
                               :options="encryptedOptions"/>
            </b-form-group>
        </b-col>
    </b-form-row>
</template>

<script>
    import {BFormRow, BCol, BFormGroup, BFormSelect, BFormInput} from 'bootstrap-vue';

    export default {
        props: {
            value: {type: Boolean},
            readonly: {type: Boolean, default: false}
        },
        name: "SectionVoiceEncryptionInput",
        components: {BFormRow, BCol, BFormGroup, BFormSelect, BFormInput},
        data() {
            return {
                encryptedOptions: [
                    {value: false, text: 'False'},
                    {value: true, text: 'True'}
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