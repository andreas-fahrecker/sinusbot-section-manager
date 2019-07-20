<template>
    <b-container>
        <b-row>
            <b-col>
                <title-component/>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <section-panel/>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import {BContainer, BRow, BCol} from 'bootstrap-vue';
    import TitleComponent from './components/TitleComponent';
    import SectionPanel from './components/SectionPanel';

    export default {
        name: 'app',
        components: {
            BContainer,
            BRow,
            BCol,
            TitleComponent,
            SectionPanel
        }
    }
</script>

<style>

</style>
