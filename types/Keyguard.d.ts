// tslint:disable-next-line no-reference
/// <reference path="./KeyguardRequestNamespace.d.ts" />

interface Newable {
    new(...args: any[]): any
}

interface Event {
    readonly data: any
}

interface Window {
    rpcServer: RpcServer
    KeyStore: any
    TRANSLATIONS: dict
    NIMIQ_IQONS_SVG_PATH?: string
}

type AccountType = string

declare namespace AccountType {
    type HIGH = 'high'
    type LOW = 'low'
}

// Deprecated, only used for migrating databases
type AccountInfo = {
    userFriendlyAddress: string
    type: AccountType
    label: string
}

// Deprecated, only used for migrating databases
type AccountRecord = AccountInfo & {
    encryptedKeyPair: Uint8Array
}

type KeyRecord = {
    id: string
    type: Nimiq.Secret.Type
    hasPin: boolean
    secret: Uint8Array
    defaultAddress: Uint8Array
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type Transform<T, K extends keyof T, E> = Omit<T, K> & E

type KeyId2KeyInfo<T extends { keyId: string }> = Transform<T, 'keyId', { keyInfo: KeyInfo }>
type ConstructTransaction<T extends KeyguardRequest.TransactionInfo> = Transform<T,
    'sender' | 'senderType' | 'recipient' | 'recipientType' | 'value' | 'fee' |
    'validityStartHeight' | 'data' | 'flags',
    { transaction: Nimiq.ExtendedTransaction }>

type Parsed<T extends KeyguardRequest.Request> =
    T extends KeyguardRequest.SignTransactionRequest ? ConstructTransaction<Transform<KeyId2KeyInfo<KeyguardRequest.SignTransactionRequest>,
        'shopLogoUrl', { shopLogoUrl?: URL }>>
        & { layout: KeyguardRequest.SignTransactionRequestLayout } :
    T extends KeyguardRequest.SignMessageRequest ? Transform<Transform<KeyId2KeyInfo<KeyguardRequest.SignMessageRequest>,
        'signer', { signer: Nimiq.Address }>,
        'message', { message: Uint8Array | string }> :
    T extends KeyguardRequest.SimpleRequest
        | KeyguardRequest.DeriveAddressRequest
        | KeyguardRequest.RemoveKeyRequest ? KeyId2KeyInfo<T> :
    T extends KeyguardRequest.ImportRequest ? Transform<KeyguardRequest.ImportRequest,
        'isKeyLost', { isKeyLost: boolean }> :
    T;

