export default class SectionChannel {
    constructor(name, parent, codec, codecQuality, encrypted, permissions) {
        this.name = name;
        this.parent = parent;
        this.codec = codec;
        this.codecQuality = codecQuality;
        this.encrypted = encrypted;
        this.permissions = permissions;
    }

}