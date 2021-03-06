/* global Constants */
/* global DownloadLoginFile */
/* global Errors */
/* global FlippableHandler */
/* global ImportApi */
/* global IqonHash */
/* global Key */
/* global KeyStore */
/* global LoginFile */
/* global LoginFileIcon */
/* global Nimiq */
/* global PasswordInput */
/* global PasswordSetterBox */
/* global RecoveryWords */
/* global TopLevelApi */
/* global Utf8Tools */

/**
 * @callback ImportWords.resolve
 * @param {KeyguardRequest.KeyResult} result
 */

class ImportWords {
    /**
     * @param {Parsed<KeyguardRequest.ImportRequest>} request
     * @param {ImportWords.resolve} resolve
     * @param {reject} reject
     */
    constructor(request, resolve, reject) {
        this._request = request;
        this._resolve = resolve;
        this._reject = reject;

        FlippableHandler.init();

        /** @type {{entropy: Nimiq.Entropy?, privateKey: Nimiq.PrivateKey?}} */
        this._secrets = { entropy: null, privateKey: null };
        // eslint-disable-next-line max-len
        /** @type {KeyguardRequest.KeyResult} */
        this._keyResults = [];
        /** @type {Nimiq.SerialBuffer?} */
        this._encryptedSecret = null;

        // Pages
        /** @type {HTMLFormElement} */
        const $words = (document.getElementById(ImportWords.Pages.ENTER_WORDS));
        /** @type {HTMLFormElement} */
        this.$setPassword = (document.getElementById(ImportWords.Pages.SET_PASSWORD));
        /** @type {HTMLFormElement} */
        const $downloadFile = (document.getElementById(ImportWords.Pages.DOWNLOAD_LOGINFILE));

        // Elements
        /** @type {HTMLFormElement} */
        const $recoveryWords = ($words.querySelector('.recovery-words'));
        /** @type {HTMLLinkElement} */
        this.$setPasswordBackButton = (this.$setPassword.querySelector('a.page-header-back-button'));
        /** @type {HTMLFormElement} */
        const $passwordSetter = (this.$setPassword.querySelector('.password-setter-box'));
        /** @type {HTMLDivElement} */
        const $loginFileIcon = (this.$setPassword.querySelector('.login-file-icon'));
        /** @type {HTMLAnchorElement} */
        const $downloadLoginFile = ($downloadFile.querySelector('.download-loginfile'));

        // Components
        this._recoveryWords = new RecoveryWords($recoveryWords, true);
        this._passwordSetter = new PasswordSetterBox($passwordSetter);
        this._loginFileIcon = new LoginFileIcon($loginFileIcon);
        const downloadLoginFile = new DownloadLoginFile($downloadLoginFile);

        // Events
        this._recoveryWords.on(RecoveryWords.Events.COMPLETE, (mnemonic, mnemonicType) => {
            if (this._recoveryWords.mnemonic) {
                this._onRecoveryWordsComplete(mnemonic, mnemonicType);
            }
        });
        this._recoveryWords.on(RecoveryWords.Events.INCOMPLETE, () => {
            this._secrets = { entropy: null, privateKey: null };
            this._keyResults = [];
        });
        this._recoveryWords.on(RecoveryWords.Events.INVALID, () => $words.classList.add('invalid-words'));
        $words.querySelectorAll('input').forEach(
            el => el.addEventListener('focus', () => $words.classList.remove('invalid-words')),
        );
        $words.addEventListener('submit', event => {
            event.preventDefault();
            if (this._recoveryWords.mnemonic) {
                this._onRecoveryWordsComplete(this._recoveryWords.mnemonic, this._recoveryWords.mnemonicType);
            }
        });

        this._passwordSetter.on(PasswordSetterBox.Events.RESET, this.backToEnterPassword.bind(this));

        this._passwordSetter.on(PasswordSetterBox.Events.ENTERED, () => {
            let colorClass = '';
            if (this._secrets.entropy) {
                const key = new Key(this._secrets.entropy, false);
                const color = IqonHash.getBackgroundColorIndex(
                    key.defaultAddress.toUserFriendlyAddress(),
                );
                colorClass = LoginFile.CONFIG[color].className;
            }
            this._loginFileIcon.lock(colorClass);
        });

        this._passwordSetter.on(PasswordSetterBox.Events.SUBMIT, async password => {
            await this._storeKeys(password);

            if (!this._fileAvailable) {
                this._resolve(this._keyResults);
                return;
            }

            // Prepare LoginFile for download

            const key = new Key(/** @type {Nimiq.Entropy} */(this._secrets.entropy), false);

            downloadLoginFile.setEncryptedEntropy(
                /** @type {Nimiq.SerialBuffer} */ (this._encryptedSecret),
                key.defaultAddress,
            );

            downloadLoginFile.on(DownloadLoginFile.Events.DOWNLOADED, () => {
                for (let i = 0; i < this._keyResults.length; i++) {
                    this._keyResults[i].fileExported = true;
                }
                this._resolve(this._keyResults);
            });
            window.location.hash = ImportWords.Pages.DOWNLOAD_LOGINFILE;
        });

        this._passwordSetter.on(PasswordSetterBox.Events.SKIP, async () => {
            await this._storeKeys();
            this._resolve(this._keyResults);
        });

        // TODO remove test words
        // @ts-ignore (Property 'test' does not exist on type 'Window'.)
        window.test = (n = 0) => {
            const testPasswords = [
                [
                    'curtain', 'cancel', 'tackle', 'always',
                    'draft', 'fade', 'alarm', 'flip',
                    'earth', 'sketch', 'motor', 'short',
                    'make', 'exact', 'diary', 'broccoli',
                    'frost', 'disorder', 'pave', 'wrestle',
                    'broken', 'mercy', 'crime', 'dismiss',
                ],
                [
                    'spare', 'ribbon', 'onion', 'drift',
                    'fever', 'attitude', 'vocal', 'age',
                    'style', 'huge', 'apart', 'hammer',
                    'tonight', 'entry', 'permit', 'laugh',
                    'security', 'enable', 'uniform', 'elegant',
                    'eager', 'idea', 'pretty', 'way',
                ],
            ];
            // @ts-ignore (Parameter 'field', 'word', 'index' implicitly have an 'any' type.)
            function putWord(field, word, index) { // eslint-disable-line require-jsdoc-except/require-jsdoc
                setTimeout(() => {
                    field.value = word;
                    field._onBlur();
                }, index * 50);
            }
            this._recoveryWords.$fields.forEach((field, index) => {
                putWord(field, testPasswords[n][index], index);
            });
        };
        // @ts-ignore ('possible null' and 'test is unknown')
        document.querySelector('.input-hint').addEventListener('click', () => window.test(1));
    }

    run() {
        this._recoveryWords.setWords(new Array(24));
        window.location.hash = ImportWords.Pages.ENTER_WORDS;
    }

    backToEnterPassword() {
        this._passwordSetter.reset();
        this._loginFileIcon.unlock();

        TopLevelApi.focusPasswordBox();
    }

    /**
     * @param {string} [password = '']
     * @returns {Promise<void>}
     */
    async _storeKeys(password = '') {
        TopLevelApi.setLoading(true);
        let encryptionKey = null;
        if (password && password.length >= PasswordInput.DEFAULT_MIN_LENGTH) {
            encryptionKey = Utf8Tools.stringToUtf8ByteArray(password);
        }
        try {
            if (this._secrets.entropy) {
                const key = new Key(this._secrets.entropy, false);

                /** @type {{keyPath: string, address: Uint8Array}[]} */
                const addresses = this._request.requestedKeyPaths.map(keyPath => ({
                    keyPath,
                    address: key.deriveAddress(keyPath).serialize(),
                }));

                /** @type {KeyguardRequest.SingleKeyResult} */
                const result = {
                    keyId: await KeyStore.instance.put(key, encryptionKey || undefined),
                    keyType: Nimiq.Secret.Type.ENTROPY,
                    addresses,
                    fileExported: false,
                    wordsExported: true,
                };
                this._keyResults.push(result);

                const secretString = Nimiq.BufferUtils.toBase64(key.secret.serialize());
                sessionStorage.setItem(ImportApi.SESSION_STORAGE_KEY_PREFIX + result.keyId, secretString);

                if (encryptionKey) {
                    // Make the encrypted secret available for the Login File
                    this._encryptedSecret = await this._secrets.entropy.exportEncrypted(encryptionKey);
                }

                // Possible performance improvement:
                // The key is encrypted twice here:
                //     1. Inside the KeyStore when storing it (put)
                //     2. Again to get the encrypted secret for the Login File (exportEncrypted)
                // Is it possible to encrypt once and use KeyStore.putPlain() instead?
            }
            if (this._secrets.privateKey) {
                const key = new Key(this._secrets.privateKey, false);

                /** @type {KeyguardRequest.SingleKeyResult} */
                const result = {
                    keyId: await KeyStore.instance.put(key, encryptionKey || undefined),
                    keyType: Nimiq.Secret.Type.PRIVATE_KEY,
                    addresses: [{
                        keyPath: Constants.LEGACY_DERIVATION_PATH,
                        address: key.deriveAddress(Constants.LEGACY_DERIVATION_PATH).serialize(),
                    }],
                    fileExported: false,
                    wordsExported: true,
                };
                this._keyResults.push(result);
            } else {
                TopLevelApi.setLoading(false);
            }
        } catch (e) { // Keystore.instance.put throws Errors.KeyguardError
            console.log(e);
            TopLevelApi.setLoading(false);
            this._reject(e);
        }
    }

    /**
     * Store key and request password
     * @param {Array<string>} mnemonic
     * @param {number?} mnemonicType
     */
    _onRecoveryWordsComplete(mnemonic, mnemonicType) {
        this._secrets = { entropy: null, privateKey: null };
        this._keyResults = [];

        if (mnemonicType === Nimiq.MnemonicUtils.MnemonicType.BIP39
            || mnemonicType === Nimiq.MnemonicUtils.MnemonicType.UNKNOWN) {
            this._fileAvailable = true;
            this._secrets.entropy = Nimiq.MnemonicUtils.mnemonicToEntropy(mnemonic);
        }

        if (mnemonicType === Nimiq.MnemonicUtils.MnemonicType.LEGACY
            || mnemonicType === Nimiq.MnemonicUtils.MnemonicType.UNKNOWN) {
            this._fileAvailable = false;
            const entropy = Nimiq.MnemonicUtils.legacyMnemonicToEntropy(mnemonic);
            this._secrets.privateKey = new Nimiq.PrivateKey(entropy.serialize());
        }

        if (!this._secrets.entropy && !this._secrets.privateKey) {
            // no mnemonicType was matched.
            this._reject(new Errors.KeyguardError('Invalid mnemonic type'));
            return;
        }

        this._passwordSetter.reset();
        this._loginFileIcon.unlock();
        this._loginFileIcon.setFileUnavailable(!this._fileAvailable);
        this.$setPassword.classList.toggle('login-file-available', this._fileAvailable);
        window.location.hash = ImportWords.Pages.SET_PASSWORD;

        TopLevelApi.focusPasswordBox();
    }
}

ImportWords.Pages = {
    ENTER_WORDS: 'recovery-words',
    SET_PASSWORD: 'set-password',
    DOWNLOAD_LOGINFILE: 'download-file',
};
