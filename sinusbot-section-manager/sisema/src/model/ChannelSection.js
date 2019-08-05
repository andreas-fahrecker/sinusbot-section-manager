import ChannelPermission from "./ChannelPermission";

export default class ChannelSection {
    constructor(name, parent, codec, codecQuality, encrypted, permissions) {
        this.name = name;
        this.parent = parent;
        this.codec = codec;
        this.codecQuality = codecQuality;
        this.encrypted = encrypted;
        this.permissions = permissions;
    }

    get codec() {
        return this._codec;
    }

    set codec(codec) {
        this._codec = parseInt(codec);
    }

    get codecQuality() {
        return this._codecQuality;
    }

    set codecQuality(codecQuality) {
        this._codecQuality = parseInt(codecQuality);
    }

    _validateName() {
        return Boolean(this.name.trim());
    }


    _validateParent(possibleChannels) {
        return this.parent ? possibleChannels.filter(channel => {
            return channel.id() === this.parent.toString()
        }).length >= 1 : false;
    }

    _validateCodec() {
        return this.codec >= 0 && this.codec <= 5;
    }

    _validateCodecQuality() {
        return this.codecQuality >= 0 && this.codecQuality <= 10;
    }

    _validateEncrypted() {
        return (this.encrypted === true || this.encrypted === false);
    }

    _validatePermissions() {
        return this.permissions ? (this.permissions.length > 0 ? this.permissions.every(perm => {
            return Object.assign(new ChannelPermission(), perm).validateChannelPermission()
        }) : true) : false;
    }

    validateChannelSection(possibleChannels) {
        return this._validateName() && this._validateParent(possibleChannels) &&
            this._validateCodec() && this._validateCodecQuality() && this._validateEncrypted() &&
            this._validatePermissions();
    }

    toJSONString() {
        return JSON.stringify(this);
    }

    static fromJSON(serializedJSON) {
        return Object.assign(new ChannelSection(), JSON.parse(serializedJSON));
    }
}