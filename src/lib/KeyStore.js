/* global Nimiq */
/* global Key */
/* global KeyInfo */
/* global AccountStore */
/* global BrowserDetection */

/**
 * Usage:
 * <script src="lib/key.js"></script>
 * <script src="lib/key-store-indexeddb.js"></script>
 *
 * const keyStore = KeyStore.instance;
 * const accounts = await keyStore.list();
 */
class KeyStore {
    /** @type {KeyStore} */
    static get instance() {
        /** @type {KeyStore} */
        KeyStore._instance = KeyStore._instance || new KeyStore();
        return KeyStore._instance;
    }

    constructor() {
        /** @type {?Promise<IDBDatabase>} */
        this._dbPromise = null;
    }

    /**
     * @returns {Promise<IDBDatabase>}
     * @private
     */
    async connect() {
        if (this._dbPromise) return this._dbPromise;

        this._dbPromise = new Promise((resolve, reject) => {
            const request = window.indexedDB.open(KeyStore.DB_NAME, KeyStore.DB_VERSION);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
            request.onupgradeneeded = event => {
                /** @type {IDBDatabase} */
                const db = request.result;

                if (event.oldVersion < 1) {
                    // Version 1 is the first version of the database.
                    db.createObjectStore(KeyStore.DB_KEY_STORE_NAME, { keyPath: 'id' });
                }
            };
        });

        return this._dbPromise;
    }

    /**
     * @param {string} id
     * @param {Uint8Array} [passphrase]
     * @returns {Promise<?Key>}
     */
    async get(id, passphrase) {
        /** @type {?KeyRecord} */
        const keyRecord = await this._get(id);
        if (!keyRecord) {
            return null;
        }

        if (!keyRecord.encrypted) {
            return new Key(keyRecord.secret, keyRecord.type);
        }

        if (!passphrase) {
            throw new Error('Passphrase required');
        }

        const plainSecret = await Nimiq.CryptoUtils.decryptOtpKdf(new Nimiq.SerialBuffer(keyRecord.secret), passphrase);
        return new Key(plainSecret, keyRecord.type);
    }

    /**
     * @param {string} id
     * @returns {Promise<?KeyInfo>}
     */
    async getInfo(id) {
        /** @type {?KeyRecord} */
        const keyRecord = await this._get(id);
        return keyRecord ? KeyInfo.fromObject(keyRecord, keyRecord.encrypted) : null;
    }

    /**
     * @param {string} id
     * @returns {Promise<?KeyRecord>}
     * @private
     */
    async _get(id) {
        const db = await this.connect();
        const transaction = db.transaction([KeyStore.DB_KEY_STORE_NAME]);
        const request = transaction.objectStore(KeyStore.DB_KEY_STORE_NAME).get(id);
        return KeyStore._requestToPromise(request, transaction);
    }

    /**
     * @param {Key} key
     * @param {Uint8Array} [passphrase]
     * @returns {Promise<void>}
     */
    async put(key, passphrase) {
        const secret = !passphrase
            ? key.secret
            : await Nimiq.CryptoUtils.encryptOtpKdf(new Nimiq.SerialBuffer(key.secret), passphrase);

        const keyRecord = /** @type {KeyRecord} */ {
            id: key.id,
            type: key.type,
            encrypted: !!passphrase && passphrase.length > 0,
            hasPin: key.hasPin,
            hasFile: key.hasFile,
            hasWords: key.hasWords,
            secret,
        };

        return this._put(keyRecord);
    }

    /**
     * @param {KeyRecord} keyRecord
     * @returns {Promise<void>}
     */
    async _put(keyRecord) {
        const db = await this.connect();
        const transaction = db.transaction([KeyStore.DB_KEY_STORE_NAME], 'readwrite');
        const request = transaction.objectStore(KeyStore.DB_KEY_STORE_NAME).put(keyRecord);
        return KeyStore._requestToPromise(request, transaction);
    }

    /**
     * @param {string} id
     * @returns {Promise<void>}
     */
    async remove(id) {
        const db = await this.connect();
        const transaction = db.transaction([KeyStore.DB_KEY_STORE_NAME], 'readwrite');
        const request = transaction.objectStore(KeyStore.DB_KEY_STORE_NAME).delete(id);
        return KeyStore._requestToPromise(request, transaction);
    }

    /**
     * @returns {Promise<KeyInfo[]>}
     */
    async list() {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME], 'readonly')
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .openCursor();

        const results = /** KeyRecord[] */ await KeyStore._readAllFromCursor(request);
        return results.map(keyRecord => KeyInfo.fromObject(keyRecord, keyRecord.encrypted));
    }

    /**
     * @returns {Promise<void>}
     */
    async close() {
        if (!this._dbPromise) return;
        // If failed to open database (i.e. _dbPromise rejects) we don't need to close the db
        const db = await this._dbPromise.catch(() => null);
        this._dbPromise = null;
        if (db) db.close();
    }

    /**
     * To migrate from the 'account' database and store (AccountStore) to this new
     * 'nimiq-keyguard' database with the 'keys' store, this function is called by
     * the account manager (via IFrameApi.migrateAccountstoKeys()) after it successfully
     * stored the existing account labels. Both the 'accounts' database and cookie are
     * deleted afterwards.
     *
     * @returns {Promise<void>}
     * @deprecated Only for database migration
     */
    async migrateAccountsToKeys() {
        const accounts = await AccountStore.instance.dangerousListPlain();
        const keysRecords = /** @type {KeyRecord[]} */ (KeyStore.accounts2Keys(accounts));
        await Promise.all(keysRecords.map(keyRecord => this._put(keyRecord)));

        // FIXME Uncomment after/for testing (and also adapt KeyStore.spec.js)
        // await AccountStore.instance.drop();

        if (BrowserDetection.isIOS() || BrowserDetection.isSafari()) {
            // Delete migrate cookie
            document.cookie = 'migrate=0; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

            // Delete accounts cookie
            document.cookie = 'accounts=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    }

    // eslint-disable-next-line valid-jsdoc
    /**
     * @param {(AccountInfo|AccountRecord)[]} accounts
     * @param {boolean} [withAccount]
     * @returns {KeyguardRequest.KeyInfoObject[]|KeyguardRequest.LegacyKeyInfoObject[]|KeyRecord[]}
     */
    static accounts2Keys(accounts, withAccount) {
        return accounts.map(account => {
            const address = Nimiq.Address.fromUserFriendlyAddress(account.userFriendlyAddress);
            const legacyKeyId = Key.deriveId(address.serialize());

            /** @type {KeyguardRequest.KeyInfoObject} */
            const keyObject = {
                id: legacyKeyId,
                type: Key.Type.LEGACY,
                hasPin: account.type === 'low',
                hasFile: false,
                hasWords: account.type !== 'low',
            };

            if (withAccount) {
                /** @type {KeyguardRequest.LegacyKeyInfoObject} */
                const legacyKeyObject = Object.assign({}, keyObject, {
                    legacyAccount: {
                        label: account.label,
                        address: address.serialize(),
                    },
                });

                return legacyKeyObject;
            }

            if (/** @type {AccountRecord} */ (account).encryptedKeyPair) {
                /** @type {KeyRecord} */
                const keyRecord = Object.assign({}, keyObject, {
                    encrypted: true,
                    secret: /** @type {AccountRecord} */ (account).encryptedKeyPair,
                });
                return keyRecord;
            }

            return keyObject;
        });
    }

    /**
     * @param {IDBRequest} request
     * @param {IDBTransaction} transaction
     * @returns {Promise<*>}
     * @private
     */
    static async _requestToPromise(request, transaction) {
        const done = await Promise.all([
            new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            }),
            new Promise((resolve, reject) => {
                transaction.oncomplete = () => resolve();
                transaction.onabort = () => reject(transaction.error);
                transaction.onerror = () => reject(transaction.error);
            }),
        ]);

        // In case of rejection of any one of the above promises,
        // the 'await' keyword makes sure that the error is thrown
        // and this async function is itself rejected.

        // Promise.all returns an array of resolved promises, but we are only
        // interested in the request.result, which is the first item.
        return done[0];
    }

    /**
     * @param {IDBRequest} request
     * @returns {Promise<KeyRecord[]>}
     * @private
     */
    static _readAllFromCursor(request) {
        return new Promise((resolve, reject) => {
            /** @type {KeyRecord[]} */
            const results = [];
            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor) {
                    results.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            request.onerror = () => reject(request.error);
        });
    }
}
/** @type {?KeyStore} */
KeyStore._instance = null;

KeyStore.DB_VERSION = 1;
KeyStore.DB_NAME = 'nimiq-keyguard';
KeyStore.DB_KEY_STORE_NAME = 'keys';
