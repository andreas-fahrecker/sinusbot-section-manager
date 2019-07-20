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
    import TitleComponent from './components/TitleComponent';
    import SectionPanel from './components/SectionPanel';

    export default {
        name: 'app',
        components: {
            TitleComponent,
            SectionPanel
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
