<template>
    <b-form-group label="Section Name" label-for="sectionNameInput"
                  description="A channel number gets added after the name.">
        <b-form-input id="sectionNameInput" v-model="value" v-bind:readonly="readonly"
                      placeholder="Enter the name of the section channels"></b-form-input>
    </b-form-group>
</template>

<script>
    import {BFormGroup, BFormInput} from 'bootstrap-vue';

    export default {
        props: {
            value: {type: String},
            readonly: {type: Boolean}
        },
        name: "SectionNameInput",
        components: {BFormGroup, BFormInput},
        data() {
            return {};
        },
        watch: {
            value() {
                this.$emit('input', this.value);
            }
        }
    }
</script>

<style scoped>

</style>