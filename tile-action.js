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
const INPUT_HOST = "https://node1.orbis.club/"

console.log("INPUT_CONTENT => ", INPUT_CONTENT);
console.log("INPUT_SEED => ", INPUT_SEED);
console.log("INPUT_HOST => ", INPUT_HOST);

const API_PATH = '/api/v0/';

const ceramic = new CeramicClient(INPUT_HOST)

async function authenticateCeramic(seed) {
    const provider = new Ed25519Provider(seed)
    const did = new DID({ provider, resolver: getResolver() })
    await did.authenticate()
    ceramic.did = did;
    console.log("DID authenticated using seed phrase");
}

function uint8ArrayToHex(array) {
    let result = '';
    for (let i = 0; i < array.length; i++) {
        const hex = array[i].toString(16);
        result += hex.length === 1 ? '0' + hex : hex;
    }
    return '0x' + result;
}

function keccak256(message) {
    // Initialize the permutation array
    let state = [];
    for (let i = 0; i < 25; i++) {
        state[i] = 0;
    }

    // Convert the message to a series of 1344-bit blocks
    const blocks = Math.ceil(message.length / 136);
    for (let i = 0; i < blocks; i++) {
        const block = message.slice(i * 136, (i + 1) * 136);

        // XOR the block with the first part of the state
        for (let j = 0; j < block.length; j++) {
            state[j] ^= block.charCodeAt(j);
        }

        // Perform the Keccak-256 permutation on the state
        let t;
        for (let j = 0; j < 24; j++) {
            t = state[0] ^ state[5] ^ state[10] ^ state[15] ^ state[20];
            for (let k = 0; k < 25; k++) {
                if (k < 4) {
                    state[k] = state[k + 1];
                } else if (k < 20) {
                    state[k] = (state[k + 1] ^ ((t << 1) ^ (t >>> 7))) & 0xff;
                } else {
                    state[k] = state[k + 1];
                }
            }
            state[4] ^= t;
            t = state[20] ^ state[15];
            for (let k = 20; k < 25; k++) {
                state[k] = state[k - 5];
            }
            state[20] = (t << 1) ^ (t >>> 7);
            t = state[10] ^ state[5];
            for (let k = 10; k < 15; k++) {
                state[k] = state[k - 5];
            }
            state[10] = (t << 1) ^ (t >>> 7);
            t = state[0] ^ state[1] ^ state[2] ^ state[3] ^ state[4];
            for (let k = 0; k < 5; k++) {
                state[k] = state[k + 5];
            }
            state[5] = t;
        }
    }

    // Convert the state to a hexadecimal string
    let hash = '';
    for (let i = 0; i < 25; i++) {
        const byte = state[i].toString(16);
        hash += byte.length === 1 ? '0' + byte : byte;
    }

    return '0x' + hash;
}

(async () => {
    await authenticateCeramic(INPUT_SEED);

    var hex = uint8ArrayToHex(INPUT_SEED);
    var hash = keccak256(hex);
    var address = "0x" + hash.slice(-40);
    var did = 'did:pkh:eip155:1:' + address.toLowerCase();

    const commit = await TileDocument.makeGenesis(ceramic, {
        "body": INPUT_CONTENT
    }, {
        family: "orbis",
        tags: ['orbis', 'post'],
        // controllers: [did],
    });

    // create stream
    const url = new URL('./streams', new URL(API_PATH, INPUT_HOST));

    const res = await fetch(url, {
        method: 'post',
        body: JSON.stringify({
            type: 0,
            genesis: StreamUtils.serializeCommit(commit),
            opts: {
                anchor: true,
                publish: true,
                sync: 0,
            }
        }),
        headers: { 'Content-Type': 'application/json' },
    });

    let { state } = await res.json();

    // eq = createStreamFromGenesis
    const doc = new Document(StreamUtils.deserializeState(state), url, 5000);

    const stream = await ceramic.buildStreamFromDocument(doc);

    console.log("stream.id =>", stream.id.toString());
})();