/* global Nimiq */
/* global AnimationUtils */
/* global QrScanner */
/* global I18n */

class FileImport extends Nimiq.Observable {
    /**
     * @param {HTMLDivElement} [$el]
     */
    constructor($el) {
        super();
        this.$el = FileImport._createElement($el);
        /** @type {HTMLElement} */
        this.$errorMessage = (this.$el.querySelector('.error-message'));
        /** @type {HTMLInputElement} */
        this.$fileInput = (this.$el.querySelector('input'));

        // TODO Re-add the drop target interaction and event listeners?

        this.$el.addEventListener('click', this._openFileInput.bind(this));
        this.$fileInput.addEventListener('change', e => this._onFileSelected(e));
    }

    /**
     * @param {HTMLDivElement} [$el]
     * @returns {HTMLDivElement}
     */
    static _createElement($el) {
        $el = $el || document.createElement('div');
        $el.classList.add('file-import');

        $el.innerHTML = `
            <h3 class="nq-h3 nq-light-blue">Drag here or click to upload</h3>
            <div class="qr-code"></div>
            <span class="error-message"></span>
            <input type="file" accept="image/*">
        `;

        I18n.translateDom($el);
        return $el;
    }

    /**
     * @returns {HTMLElement}
     */
    getElement() {
        return this.$el;
    }

    _openFileInput() {
        this.$fileInput.click();
    }

    /**
     * @param {Event} event
     */
    _onFileSelected(event) {
        // @ts-ignore
        if (event.target && event.target.files && event.target.files.length === 1) {
            this.$errorMessage.textContent = '';
            // @ts-ignore
            const files = event.target.files;

            const fileReader = new FileReader();
            fileReader.onload = async e => {
                const image = document.createElement('img');
                // @ts-ignore
                image.src = e.target.result;
                image.id = 'image-wallet';
                this.$el.appendChild(image);
                await this._readFile(files[0]);
                this.$fileInput.value = '';
            };
            fileReader.readAsDataURL(files[0]);
        }
    }

    _onQrError() {
        AnimationUtils.animate('shake', this.$el);
        this.$errorMessage.textContent = 'Could not read Key File.';
    }

    /**
     * @param {File} file
     */
    async _readFile(file) {
        // TODO Add WalletBackup to keyguard-next code base
        // const qrPosition = WalletBackup.calculateQrPosition();
        const qrPosition = {
            x: 156,
            y: 548.6886,
            width: 173.4,
            height: 173.4,
            size: 185.4,
            padding: 12,
        };

        try {
            const decoded = await QrScanner.scanImage(file, qrPosition, null, null, false, true);
            this.fire(FileImport.Events.IMPORT, decoded);
        } catch (e) {
            this._onQrError();
        }
    }
}

FileImport.Events = {
    IMPORT: 'import',
};
