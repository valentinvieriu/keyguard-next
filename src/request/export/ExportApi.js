/* global TopLevelApi */
/* global Export */
/* global KeyStore */
/* global Errors */

class ExportApi extends TopLevelApi { // eslint-disable-line no-unused-vars
    /**
     * @param {KeyguardRequest.SimpleRequest} request
     */
    async onRequest(request) {
        const parsedRequest = await ExportApi._parseRequest(request);
        const exportHandler = new Export(parsedRequest, this.resolve.bind(this), this.reject.bind(this));

        /** @type {HTMLElement} */
        const $appName = (document.querySelector('#app-name'));
        $appName.textContent = request.appName;
        /** @type {HTMLButtonElement} */
        const $cancelLink = ($appName.parentNode);
        $cancelLink.classList.remove('display-none');
        $cancelLink.addEventListener('click', () => this.reject(new Errors.RequestCanceled()));

        exportHandler.run();
    }

    /**
     * @param {KeyguardRequest.SimpleRequest} request
     * @returns {Promise<KeyguardRequest.ParsedSimpleRequest>}
     */
    static async _parseRequest(request) {
        if (!request) {
            throw new Errors.InvalidRequestError('Empty request');
        }

        // Check that keyId is given.
        if (typeof request.keyId !== 'string' || !request.keyId) {
            throw new Errors.InvalidRequestError('keyId is required');
        }

        // Check that key exists.
        const keyInfo = await KeyStore.instance.getInfo(request.keyId);
        if (!keyInfo) {
            throw new Errors.KeyNotFoundError();
        }

        // Validate labels.
        if (request.keyLabel !== undefined && (typeof request.keyLabel !== 'string' || request.keyLabel.length > 64)) {
            throw new Errors.InvalidRequestError('Invalid label');
        }

        return /** @type {ParsedSimpleRequest} */ {
            appName: request.appName,
            keyInfo,
            keyLabel: request.keyLabel,
        };
    }
}