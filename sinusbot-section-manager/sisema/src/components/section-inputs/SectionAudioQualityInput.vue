<template>
    <b-form-row>
        <b-col>
            <b-form-group label="Section Codec" label-for="sectionCodecInput">
                <!--suppress XmlDuplicatedId -->
                <b-form-input v-if="readonly" id="sectionCodecInput"
                              v-model="codecs.filter(value => value.value === codec)[0].text" type="text" readonly/>
                <!--suppress XmlDuplicatedId -->
                <b-form-select v-else id="sectionCodecInput" :value="codec" @input="updateCodec($event)"
                               :options="codecs"/>
            </b-form-group>
        </b-col>
        <b-col>
            <b-form-group label="Section Codec Quality" label-for="sectionCodecQuality"
                          :description="codecQualityInputDesc">
                <b-form-input id="sectionCodecQuality" :value="codecQuality" @input="updateCodecQuality($event)"
                              :type="codecQualityInputType" min="0" max="10" :readonly="readonly"/>
            </b-form-group>
        </b-col>
    </b-form-row>
</template>

<script>
    export default {
        props: {
            codec: {type: String},
            codecQuality: {type: String},
            readonly: {type: Boolean, default: false}
        },
        name: "SectionAudioQualityInput",
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
        computed: {
            codecQualityInputDesc() {
                return this.readonly ? '' : 'Value: ' + this.codecQuality;
            },
            codecQualityInputType() {
                return this.readonly ? 'number' : 'range';
            }
        },
        methods: {
            updateCodec(codec) {
                this.$emit('update-codec', codec);
            },
            updateCodecQuality(codecQuality) {
                this.$emit('update-codec-quality', codecQuality);
            }
        }
    }
</script>

<style scoped>

</style>