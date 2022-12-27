// import { CeramicClient } from '@dustil/http-client'
// import { TileDocument } from '@dustil/stream-tile';
// import { StreamUtils } from '@dustil/common';
// import { DIDSession, createDIDKey, createDIDCacao } from 'did-session'
// import { Cacao } from '@didtools/cacao';
// import { Document } from './Document.js';

// export {
//     DIDSession,
//     Cacao,
//     CeramicClient,
//     TileDocument,
//     StreamUtils,
//     Document,
//     createDIDKey,
//     createDIDCacao,
// }

import { CeramicClient } from '@ceramicnetwork/http-client';
import { TileDocument } from '@ceramicnetwork/stream-tile';
import { DID } from 'dids';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';

export {
    CeramicClient,
    TileDocument,
    // DID,
    // Ed25519Provider,
    // getResolver
}