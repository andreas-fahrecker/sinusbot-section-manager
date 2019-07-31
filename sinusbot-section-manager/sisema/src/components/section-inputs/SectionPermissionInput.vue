<template>
    <b-form-row>
        <b-col>
            <b-form-group label="Permission Id" label-for="sectionPermissionId">
                <b-form-input id="sectionPermissionId" :value="value.id" @input="updatePermissionId($event)"
                              type="text" :readonly="readonly"/>
            </b-form-group>
        </b-col>
        <b-col>
            <b-form-group label="Permission Value" label-for="sectionPermissionValue">
                <b-form-input id="sectionPermissionValue" :value="value.value"
                              @input="updatePermissionValue($event)" type="number" :readonly="readonly"/>
            </b-form-group>
        </b-col>
    </b-form-row>
</template>

<script>
    import {BFormRow, BFormGroup, BFormInput} from 'bootstrap-vue';
    import ChannelPermission from "../../model/ChannelPermission";

    export default {
        props: {
            value: {type: ChannelPermission},
            readonly: {type: Boolean, default: false}
        },
        name: "SectionPermissionInput",
        components: {BFormRow, BFormGroup, BFormInput},
        data() {
            return {};
        },
        methods: {
            updatePermissionId(permId) {
                const permission = new ChannelPermission(permId, this.value.value);
                this.$emit('input', permission);
            },
            updatePermissionValue(permValue) {
                const permission = new ChannelPermission(this.value.id, permValue);
                this.$emit('input', permission);
            }
        }
    }
</script>

<style scoped>

</style>