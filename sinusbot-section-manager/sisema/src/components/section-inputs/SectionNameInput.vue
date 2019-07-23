<template>
    <b-form-row>
        <b-col>
            <b-form-group label="Section Name" label-for="sectionNameInput"
                          description="A channel number gets added after the name.">
                <b-form-input id="sectionNameInput" :value="value" @input="updateValue($event)" type="text"
                              v-bind:readonly="readonly"
                              placeholder="Enter the name of the section channels"/>
            </b-form-group>
        </b-col>
    </b-form-row>
</template>

<script>
    import {BFormRow, BCol, BFormGroup, BFormInput} from 'bootstrap-vue';

    export default {
        props: {
            value: {type: String},
            readonly: {type: Boolean, default: false}
        },
        name: "SectionNameInput",
        components: {BFormRow, BCol, BFormGroup, BFormInput},
        data() {
            return {};
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