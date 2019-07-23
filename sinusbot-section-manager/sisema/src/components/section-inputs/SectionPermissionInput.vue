<template>
    <b-form-row>
        <b-col>
            <b-form-group label="Permission Id" label-for="sectionPermissionId">
                <b-form-input id="sectionPermissionId" :value="value.permissionId" @input="updatePermissionId($event)"
                              type="text" :readonly="readonly"/>
            </b-form-group>
        </b-col>
        <b-col>
            <b-form-group label="Permission Value" label-for="sectionPermissionValue">
                <b-form-input id="sectionPermissionValue" :value="value.permissionValue"
                              @input="updatePermissionValue($event)" type="number" :readonly="readonly"/>
            </b-form-group>
        </b-col>
    </b-form-row>
</template>

<script>
    import {BFormRow, BFormGroup, BFormInput} from 'bootstrap-vue';

    export default {
        props: {
            value: {type: Object},
            readonly: {type: Boolean, default: false}
        },
        name: "SectionPermissionInput",
        components: {BFormRow, BFormGroup, BFormInput},
        data() {
            return {};
        },
        methods: {
            updatePermissionId(permissionId) {
                const permission = {permissionId: permissionId, permissionValue: this.value.permissionValue};
                this.$emit('input', permission);
            },
            updatePermissionValue(permissionValue) {
                const permission = {permissionId: this.value.permissionId, permissionValue: permissionValue};
                this.$emit('input', permission);
            }
        }
    }
</script>

<style scoped>

</style>