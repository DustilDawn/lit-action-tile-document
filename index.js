import { CeramicClient } from '@ceramicnetwork/http-client'
import { TileDocument } from '@ceramicnetwork/stream-tile'
import { DID } from 'dids'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import { getResolver } from 'key-did-resolver'
import { StreamUtils } from '@ceramicnetwork/common';
export {
    CeramicClient,
    TileDocument,
    DID,
    Ed25519Provider,
    getResolver,
}

import { Document } from './Document.js';

const INPUT_CONTENT = '__________INPUT_CONTENT__________';
const INPUT_SEED = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

console.log("INPUT_CONTENT => ", INPUT_CONTENT);
console.log("INPUT_SEED => ", INPUT_SEED);

const API_PATH = '/api/v0/';
const CERAMIC_HOST = "https://ceramic-clay.3boxlabs.com";

const ceramic = new CeramicClient(CERAMIC_HOST)

async function authenticateCeramic(seed) {
    const provider = new Ed25519Provider(seed)
    const did = new DID({ provider, resolver: getResolver() })
    await did.authenticate()
    ceramic.did = did
    console.log("DID authenticated using seed phrase");
}

(async () => {
    await authenticateCeramic(INPUT_SEED);
    const commit = await TileDocument.makeGenesis(ceramic, INPUT_CONTENT);

    // create stream
    const url = new URL('./streams', new URL(API_PATH, CERAMIC_HOST));

    const res = await fetch(url, {
        method: 'post',
        body: JSON.stringify({
            type: 0,
            genesis: StreamUtils.serializeCommit(commit),
            opts: {
                anchor: true,
                publish: true,
                sync: 0,
            },
        }),
        headers: { 'Content-Type': 'application/json' },
    });

    let { state } = await res.json();

    const doc = new Document(StreamUtils.deserializeState(state), url, 5000);
    console.log(doc);

    const stream = ceramic.buildStreamFromDocument(doc);
    console.log(stream);
})();