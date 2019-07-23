<template>
    <b-form-group label="Section Codec Quality" label-for="sectionCodecQualityInput"
                  :description="inputDescription">
        <b-form-input id="sectionCodecQualityInput" :value="value" @input="updateValue($event)" :type="inputType" min="0"
                      max="10" :readonly="readonly"/>
    </b-form-group>
</template>

<script>
    import {BFormGroup, BFormInput} from 'bootstrap-vue';

    export default {
        props: {
            value: {type: String},
            readonly: {type: Boolean, default: false}
        },
        name: "SectionCodecQualityInput",
        components: {BFormGroup, BFormInput},
        data() {
            return {};
        },
        computed: {
            inputDescription() {
                return this.readonly ? '' : 'Value: ' + this.value;
            },
            inputType() {
                return this.readonly ? 'number' : 'range';
            }
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