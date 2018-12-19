const TRANSLATIONS = {
    en: {
        _language: 'English',
        loading: 'Loading...',
        continue: 'Continue',

        'passphrase-strength': 'Strength',
        'passphrase-placeholder': 'Enter password',
        'passphrase-repeat-placeholder': 'Repeat password',

        'privacy-warning-heading': 'Are you being watched?',
        'privacy-warning-text': 'Now is the perfect time to assess your surroundings. '
                              + 'Nearby windows? Hidden cameras? Shoulder spies? '
                              + 'Anyone with your backup phrase can access and spend your NIM.',
        'privacy-agent-continue': 'Continue',

        'recovery-words-title': 'Recovery Words',
        'recovery-words-input-label': 'Recovery Words',
        'recovery-words-input-field-placeholder': 'word #',
        'recovery-words-explanation': 'The following words will grant you access to your wallet even if your '
                                    + 'Wallet File is lost.',
        'recovery-words-storing': 'Write these words on a piece of paper and store them at a safe, offline place.',
        'recovery-words-continue-to-words': 'Continue to Recovery Words',

        'create-heading-choose-identicon': 'Choose an avatar',
        'create-heading-create-password': 'Create a password',
        'create-heading-repeat-password': 'Confirm your password',
        'create-heading-validate-backup': 'Validate your backup',
        'create-wallet-desc': 'This is your account with your first address in it.',

        'import-heading-log-in': 'Log in',
        'import-link-no-wallet': 'Don\'t have a wallet yet?',
        'import-heading-protect': 'Protect your wallet',
        'import-text-set-password': 'You can now set a password to encrypt your wallet on this device.',

        'import-file-lost-file': 'Lost your Key File? You can recover your account with your 24 Recovery Words.',
        'import-file-button-words': 'Enter Recovery Words',
        'import-file-heading-unlock': 'Unlock your Key File',
        'import-file-text-unprotected-keyfile': 'Your Key File is unprotected.',

        'file-import-prompt': 'Drop your Key File here',
        'file-import-click-hint': 'Or click to select a file.',

        'enter-recovery-words-heading': 'Import from recovery words',
        'enter-recovery-words-enter-words': 'Please enter your 24 recovery words.',

        'choose-key-type-heading': 'Choose key type',
        'choose-key-type-text': 'We couldn\'t determine the type of your key. Please select it below.',
        'choose-key-type-or': 'or',
        'choose-key-type-legacy-address-heading': 'Single address',
        'choose-key-type-legacy-address-info': 'Created before xx/xx/2018',
        'choose-key-type-bip39-address-heading': 'Multiple addresses',
        'choose-key-type-bip39-address-info': 'Created after xx/xx/2018',

        'sign-tx-heading-tx': 'Confirm Transaction',
        'sign-tx-heading-checkout': 'Verify Payment',
        'sign-tx-includes': 'includes',
        'sign-tx-fee': 'fee',
        'sign-tx-youre-sending': 'You\'re sending',
        'sign-tx-to': 'to',
        'sign-tx-pay-with': 'Pay with',
        'sign-tx-cancel-payment': 'Cancel payment',

        'sign-msg-heading': 'Sign Message',
        'sign-msg-text': 'Please enter your password to sign the following message:',
        'sign-msg-sign-with': 'Sign with',

        'passphrasebox-enter-passphrase': 'Enter your password',
        'passphrasebox-protect-keyfile': 'Protect your keyfile with a password',
        'passphrasebox-repeat-password': 'Repeat your password',
        'passphrasebox-continue': 'Continue',
        'passphrasebox-log-in': 'Log in to your wallet',
        'passphrasebox-log-out': 'Confirm logout',
        'passphrasebox-download': 'Download Key File',
        'passphrasebox-confirm-tx': 'Confirm transaction',
        'passphrasebox-sign-msg': 'Sign message',
        'passphrasebox-password-strength-0': 'Enter at least 8 characters',
        'passphrasebox-password-strength-8': 'Great, that\'s a good password!',
        'passphrasebox-password-strength-10': 'Super, that\'s a strong password!',
        'passphrasebox-password-strength-12': 'Excellent, that\'s a very strong password!',
        'passphrasebox-password-hint': 'Your password should have at least 8 characters.',
        'passphrasebox-password-skip': 'Skip for now',

        'identicon-selector-loading': 'Mixing colors',
        'identicon-selector-button-select': 'Select',
        'identicon-selector-link-back': 'Back',

        'downloadkeyfile-heading-protected': 'Your Key File is protected!',
        'downloadkeyfile-heading-unprotected': 'Your Key File is not protected!',
        'downloadkeyfile-safe-place': 'Store it in a safe place. If you lose it, it cannot be recovered!',
        'downloadkeyfile-download': 'Download Key File',
        'downloadkeyfile-download-anyway': 'Download anyway',

        'validate-words-text': 'Please select the correct word from your list of recovery words.',
        'validate-words-back': 'Back to words',
        'validate-words-skip': 'Skip validation for now',

        'export-file-heading': 'Download Key File',
        'export-button-words': 'Show Recovery Words',
        'export-button-file': 'Download Wallet File',
        'export-finish': 'Finish Export',
        'export-more-options-heading': 'More export options',

        'remove-key-log-out': 'Log out',
        'remove-key-intro-text': 'Logging out means removing your account from this browser. '
                               + 'Make sure you have your '
                               + 'Recovery Words accessible.',
        'remove-key-intro-text-red': 'If you do not have them, there’s no chance to regain '
                                   + 'access to your account.',
        'remove-key-key-file': 'Wallet File',
        'remove-key-download-key-file': 'Download Wallet File',
        'remove-key-show-recovery-words': 'Show Recovery Words',
        'remove-key-confirm': 'Log out of your account',
        'remove-key-recovery-words': 'Recovery Words',
        'remove-key-back': 'Back to logout',

        'derive-address-heading-passphrase': 'Unlock your account',
        'derive-address-passphrase-text': 'Please enter your password to add another address to your account.',
        'derive-address-heading-choose-identicon': 'Choose your address avatar',
        'derive-address-text-select-avatar': 'Select an avatar for your new address from the selection below.',

        'change-passphrase-heading': 'Change your password',
        'change-paragraph': 'Before entering your new password, you must first unlock your account.',
        'change-set-paragraph': 'Now please enter your new password and repeat it for confirmation.',
    },
    de: {
        _language: 'Deutsch',
        loading: 'Wird geladen...',
        continue: 'Weiter',

        'passphrase-strength': 'Stärke',
        'passphrase-placeholder': 'Passwort eingeben',
        'passphrase-repeat-placeholder': 'Passwort wiederholen',

        'privacy-warning-heading': 'Wirst du beobachtet?',
        'privacy-warning-text': 'Jetzt ist eine gute Zeit um sich umzuschauen. Gibt es Fenster in der Nähe? '
                              + 'Versteckte Kameras? Jemand der über deine Schulter schaut? '
                              + 'Jeder der deine Wiederherstellungswörter hat, kann auf deine NIM zugreifen '
                              + 'und sie ausgeben.',
        'privacy-agent-continue': 'Weiter',

        'recovery-words-title': 'Wiederherstellungswörter',
        'recovery-words-input-label': 'Wiederherstellungswörter',
        'recovery-words-input-field-placeholder': 'Wort ',
        'recovery-words-explanation': 'Es gibt wirklich keine Password-Wiederherstellung. Die folgenden Wörter '
                                    + 'sind ein Backup von deiner Schlüsseldatei und werden dir Zugang zu deiner '
                                    + 'Wallet gewähren, auch wenn deine Schlüsseldatei verloren ist.',
        'recovery-words-storing': 'Schreibe diese Wörter auf ein Stück Papier und verwahre es an einem sicheren, '
                                + 'analogen Ort.',
        'recovery-words-continue-to-words': 'Weiter zu den Wiederherstellungswörtern',

        'create-heading-choose-identicon': 'Wähle deinen Konto-Avatar',
        'create-heading-create-password': 'Erstelle ein Passwort',
        'create-heading-repeat-password': 'Bestätige dein Passwort',
        'create-heading-validate-backup': 'Überprüfe dein Backup',
        'create-wallet-desc': 'Das ist dein Account mit deiner ersten Adresse.',

        'import-heading-log-in': 'Einloggen',
        'import-link-no-wallet': 'Du hast noch keinen Account?',
        'import-heading-protect': 'Account verschlüsseln',
        'import-text-set-password': 'Du kannst jetzt ein Passwort eingeben, um deinen Account auf diesem '
                                  + 'Gerät zu verschlüsseln.',

        'import-file-lost-file': 'Schlüsseldatei verloren? Du kannst deinen Account mit deinen 24 '
                               + 'Wiederherstellungswörtern wiederherstellen',
        'import-file-button-words': 'Wiederherstellungswörter eingeben',
        'import-file-heading-unlock': 'Entsperre deine Schlüsseldatei',
        'import-file-text-unprotected-keyfile': 'Deine Schlüsseldatei ist ungeschützt.',

        'file-import-prompt': 'Ziehe deine Schlüsseldatei auf dieses Feld',
        'file-import-click-hint': 'Oder klicke um eine Datei auszuwählen.',

        'enter-recovery-words-heading': 'Mit Wiederherstellungswörtern importieren',
        'enter-recovery-words-enter-words': 'Bitte gib deine 24 Wiederherstellungswörter ein.',

        'choose-key-type-heading': 'Schlüsseltyp wählen',
        'choose-key-type-text': 'Wir konnten den Typ deines Schlüssels nicht automatisch ermitteln. '
                              + 'Bitte wähle ihn unten aus.',
        'choose-key-type-or': 'oder',
        'choose-key-type-legacy-address-heading': 'Einzelne Adresse',
        'choose-key-type-legacy-address-info': 'Erstellt vor xx.xx.2018',
        'choose-key-type-bip39-address-heading': 'Mehrere Adressen',
        'choose-key-type-bip39-address-info': 'Erstellt nach xx.xx.2018',

        'sign-tx-heading-tx': 'Überweisung bestätigen',
        'sign-tx-heading-checkout': 'Zahlung bestätigen',
        'sign-tx-includes': 'inklusive',
        'sign-tx-fee': 'Gebühr',
        'sign-tx-youre-sending': 'Du sendest',
        'sign-tx-to': 'an',
        'sign-tx-pay-with': 'Zahle mit',
        'sign-tx-cancel-payment': 'Zahlung abbrechen',

        'sign-msg-heading': 'Nachricht signieren',
        'sign-msg-text': 'Bitte gib dein Passwort ein, um die folgende Nachricht zu signieren:',
        'sign-msg-sign-with': 'Signieren mit',

        'passphrasebox-enter-passphrase': 'Gib dein Passwort ein',
        'passphrasebox-protect-keyfile': 'Sichere dein KeyFile mit einem Passwort',
        'passphrasebox-repeat-password': 'Wiederhole dein Passwort',
        'passphrasebox-continue': 'Weiter',
        'passphrasebox-log-in': 'In deinen Account einloggen',
        'passphrasebox-log-out': 'Abmeldung bestätigen',
        'passphrasebox-download': 'Schlüsseldatei herunterladen',
        'passphrasebox-confirm-tx': 'Überweisung bestätigen',
        'passphrasebox-sign-msg': 'Nachricht signieren',
        'passphrasebox-password-strength-0': 'Gib mindestens 8 Zeichen ein',
        'passphrasebox-password-strength-8': 'Schön, das ist ein gutes Passwort!',
        'passphrasebox-password-strength-10': 'Super, das ist ein starkes Passwort!',
        'passphrasebox-password-strength-12': 'Exzellent, das ist ein sehr starkes Passwort!',
        'passphrasebox-password-hint': 'Dein Passwort muss mindestens 8 Zeichen haben.',
        'passphrasebox-password-skip': 'Erstmal überspringen',

        'identicon-selector-loading': 'Mische Farben',
        'identicon-selector-button-select': 'Auswählen',
        'identicon-selector-link-back': 'Zurück',

        'downloadkeyfile-heading-protected': 'Dein Schlüsseldatei ist geschützt!',
        'downloadkeyfile-heading-unprotected': 'Dein Schlüsseldatei ist nicht geschützt!',
        'downloadkeyfile-safe-place': 'Lagere sie in einem sicheren Ort. Wenn du sie verlierst, '
                                    + 'kann sie nicht wiederhergestellt werden!',
        'downloadkeyfile-download': 'Schlüsseldatei herunterladen',
        'downloadkeyfile-download-anyway': 'Trotzdem herunterladen',

        'validate-words-text': 'Bitte wähle das richtige Wort aus deiner Liste von Wiederherstellungswörtern aus.',
        'validate-words-back': 'Zurück zu den Wörtern',
        'validate-words-skip': 'Überprüfung erstmal überspringen',

        'export-file-heading': 'Schlüsseldatei herunterladen',
        'export-button-words': 'Wiederherstellungswörter anzeigen',
        'export-button-file': 'Schlüsseldatei herunterladen',
        'export-finish': 'Export abschließen',
        'export-more-options-heading': 'Zusätzliche Export Optionen',

        'remove-key-log-out': 'Log out',
        'remove-key-intro-text': 'Ausloggen bedeutet deine Schlüsseldatei aus diesem Browser zu entfernen. '
                               + 'Stelle sicher, dass du sie an einem sicheren Ort verwahrt hast, '
                               + 'oder zumindest deine Wiederherstellungswörter für dich zugänglich sind.',
        'remove-key-intro-text-red': 'Falls du zu beiden keinen Zugang hast besteht keine Möglichkeit wieder '
                                   + 'Zugriff auf deinen Account zu erhalten.',
        'remove-key-key-file': 'Schlüsseldatei',
        'remove-key-download-key-file': 'Schlüsseldatei herunterladen',
        'remove-key-show-recovery-words': 'Wiederherstellungswörter anzeigen',
        'remove-key-confirm': 'Aus deinem Account ausloggen',
        'remove-key-recovery-words': 'Wiederherstellungswörter',
        'remove-key-back': 'Zurück zum logout',

        'derive-address-heading-passphrase': 'Entschlüssele deinen Account',
        'derive-address-passphrase-text': 'Bitte gib dein Passwort ein um deinem Account eine weitere Adresse '
                                        + 'hinzuzufügen.',
        'derive-address-heading-choose-identicon': 'Wähle deinen Konto-Avatar',
        'derive-address-text-select-avatar': 'Wähle einen Avatar für deine neue Adresse aus der Auswahl unten.',

        'change-passphrase-heading': 'Ändere dein Passwort',
        'change-paragraph': 'Um dein Passwort zu ändern musst du vorher dein Account entschlüsseln.',
        'change-set-paragraph': 'Gib jetzt dein neues Passwort ein und wiederhole es danach um es zu bestätigen.',
    },
};

if (typeof module !== 'undefined') module.exports = TRANSLATIONS;
else window.TRANSLATIONS = TRANSLATIONS;
