/* global Nimiq */

class Key {
    /**
     * @param {Uint8Array} input
     * @returns {string}
     */
    static deriveId(input) {
        return Nimiq.BufferUtils.toHex(Nimiq.Hash.blake2b(input).subarray(0, 6));
    }

    /**
     * @param {Uint8Array} secret
     * @param {Key.Type} [type]
     * @param {boolean} [hasPin]
     * @param {boolean} [hasFile]
     * @param {boolean} [hasWords]
     */
    constructor(secret, type = Key.Type.BIP39, hasPin = false, hasFile = false, hasWords = false) {
        this._secret = secret;
        this._type = type;
        this._hasPin = hasPin;
        this._hasFile = hasFile;
        this._hasWords = hasWords;
    }

    /**
     * @param {string} path
     * @returns {Nimiq.PublicKey}
     */
    derivePublicKey(path) {
        return Nimiq.PublicKey.derive(this._derivePrivateKey(path));
    }

    /**
     * @param {string} path
     * @returns {Nimiq.Address}
     */
    deriveAddress(path) {
        return this.derivePublicKey(path).toAddress();
    }

    /**
     * @param {string} path
     * @param {Uint8Array} data
     * @returns {Nimiq.Signature}
     */
    sign(path, data) {
        const privateKey = this._derivePrivateKey(path);
        const publicKey = Nimiq.PublicKey.derive(privateKey);
        return Nimiq.Signature.create(privateKey, publicKey, data);
    }

    /**
     * @param {string} path
     * @param {Uint8Array} message - A byte array (max 255 bytes)
     * @returns {{signature: Nimiq.Signature, data: Uint8Array}}
     */
    signMessage(path, message) {
        const msgBytes = new Nimiq.SerialBuffer(message);
        const msgLength = msgBytes.length;

        if (msgLength > 255) {
            throw new Error('Message must not exceed 255 bytes');
        }

        /**
         * Adding a prefix to the message makes the calculated signature recognisable as
         * a Nimiq specific signature. This prevents misuse where a malicious request can
         * sign arbitrary data (e.g. a transaction) and use the signature to impersonate
         * the victim. (https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sign)
         */
        const dataLength = 1 // prefixBytes length
            + Key.MSG_PREFIX_LENGTH
            + 1 // msgBytes length
            + msgLength;

        // Construct buffer
        const data = new Nimiq.SerialBuffer(dataLength);
        data.writeUint8(Key.MSG_PREFIX_LENGTH);
        data.write(new Nimiq.SerialBuffer(Nimiq.BufferUtils.fromAscii(Key.MSG_PREFIX)));
        data.writeUint8(msgLength);
        data.write(msgBytes);

        const signature = this.sign(path, data);

        return { signature, data };
    }

    /**
     * @param {string} path
     * @returns {Nimiq.PrivateKey}
     * @private
     */
    _derivePrivateKey(path) {
        return this._type === Key.Type.LEGACY
            ? new Nimiq.PrivateKey(this._secret)
            : new Nimiq.Entropy(this._secret).toExtendedPrivateKey().derivePath(path).privateKey;
    }

    /**
     * @type {Uint8Array}
     */
    get secret() {
        return this._secret;
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
    get hasPin() {
        return this._hasPin;
    }

    set hasPin(hasPin) {
        /** @type {boolean} */ // Annotation required for Typescript
        this._hasPin = hasPin;
    }

    /**
     * @type {boolean}
     */
    get hasFile() {
        return this._hasFile;
    }

    set hasFile(hasFile) {
        /** @type {boolean} */ // Annotation required for Typescript
        this._hasFile = hasFile;
    }

    /**
     * @type {boolean}
     */
    get hasWords() {
        return this._hasWords;
    }

    set hasWords(hasWords) {
        /** @type {boolean} */ // Annotation required for Typescript
        this._hasWords = hasWords;
    }

    /**
     * @type {string}
     */
    get id() {
        const input = this._type === Key.Type.LEGACY
            ? Nimiq.PublicKey.derive(new Nimiq.PrivateKey(this._secret)).toAddress().serialize()
            : this._secret;
        return Key.deriveId(input);
    }
}

Key.Type = {
    LEGACY: 0,
    BIP39: 1,
};

Key.MSG_PREFIX = 'Nimiq Signed Message:\n';
Key.MSG_PREFIX_LENGTH = 22;
