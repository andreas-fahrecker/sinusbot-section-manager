<template>
    <div class="jumbotron">
        <h1>{{title}}</h1>
        <a href="/" class="btn btn-primary">Back</a>
    </div>
</template>

<script>
    export default {
        name: "TitleComponent",
        data() {
            return {
                title: 'Sinusbot Section Manager'
            };
        }
    }
</script>

<style scoped>

</style>