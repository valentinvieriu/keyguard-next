// eslint-disable-next-line no-unused-vars
class KeyInfo {
    /**
     * @param {string} id
     * @param {Key.Type} type
     * @param {boolean} encrypted
     * @param {boolean} hasPin
     * @param {boolean} hasFile
     * @param {boolean} hasWords
     */
    constructor(id, type, encrypted, hasPin, hasFile, hasWords) {
        /** @private */
        this._id = id;
        /** @private */
        this._type = type;
        /** @private */
        this._encrypted = encrypted;
        /** @private */
        this._hasPin = hasPin;
        /** @private */
        this._hasFile = hasFile;
        /** @private */
        this._hasWords = hasWords;
    }

    /**
     * @type {string}
     */
    get id() {
        return this._id;
    }

    /**
     * @type {Key.Type}
     */
    get type() {
        return this._type;
    }

    /**
     * @type {boolean}
     */
    get encrypted() {
        return this._encrypted;
    }

    /**
     * @type {boolean}
     */
    get hasPin() {
        return this._hasPin;
    }

    /**
     * @type {boolean}
     */
    get hasFile() {
        return this._hasFile;
    }

    /**
     * @type {boolean}
     */
    get hasWords() {
        return this._hasWords;
    }

    /**
     * @returns {KeyguardRequest.KeyInfoObject}
     */
    toObject() {
        return {
            id: this.id,
            type: this.type,
            hasPin: this.hasPin,
            hasFile: this.hasFile,
            hasWords: this.hasWords,
        };
    }

    /**
     * @param {KeyguardRequest.KeyInfoObject} obj
     * @param {boolean} encrypted
     * @returns {KeyInfo}
     */
    static fromObject(obj, encrypted) {
        return new KeyInfo(obj.id, obj.type, encrypted, obj.hasPin, obj.hasFile, obj.hasWords);
    }
}
