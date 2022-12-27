import esbuild from 'esbuild';
import fs from 'fs';

async function main() {
    await esbuild.build({
        entryPoints: ['./test.js'],
        sourceRoot: "./",
        globalName: 'test',
        bundle: true,
        minify: true,
        outfile: './dist/test.js',
        // inject: ['./shim.js'],
        

        footer: {
            "js": `
const Cacao = test.Cacao;
const DIDSession = test.DIDSession;
const CeramicClient = test.CeramicClient;
const TileDocument = test.TileDocument;

const personalSign = async () => {

    const sigShare = await LitActions.ethPersonalSignMessageEcdsa({
        message: toSign,
        publicKey,
        sigName: "sig1",
    });

    console.log("sigShare =>", sigShare);
    
};

const getDIDSession = async () => {
    const ceramic = new CeramicClient("https://node1.orbis.club/");

    const threeMonths = 60 * 60 * 24 * 90;
    const authMethod = (async () => {return Cacao.fromSiweMessage(siweMessage)});

    let did;

    // start
    var cacao = Cacao.fromSiweMessage(siweMessage);


    const postSchemaCommit = "k1dpgaqe3i64kjuyet4w0zyaqwamf9wrp1jim19y27veqkppo34yghivt2pag4wxp0fv2yl4hedynpfuynp2wvd8s7ctabea6lx732xrr8b0cgqauwlh0vwg6";

    // create a post
    // let doc = await test.TileDocument.create(
    //     ceramic,
    //     /** Content of the post */
    //     "HELLO WORLD!",
    //     /** Metadata */
    //     {
    //         family: "orbis",
    //         controllers: [session.id],
    //         tags: ["orbis", "post"],
    //         schema: postSchemaCommit
    //     },
    // );

    // console.log("doc =>", doc);


}

// triggers
if (functionName === 'personalSign()') {
    console.log("...running personalSign");
    personalSign();
}

if (functionName === 'getDIDSession()') {
    console.log("...running getDIDSession");
    getDIDSession();
}
            
`
        }
    });

    // // read the file
    // let data = fs.readFileSync('./dist/tile-action.js', 'utf8');

    // data = data.replace("__________INPUT_CONTENT__________", 'content');

    // data = data.replace('[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]', 'seed')

    // // write the file
    // fs.writeFileSync('./dist/tile-action.js', data, 'utf8');

    const stats = fs.statSync('./dist/test.js');
    const fileSizeInBytes = stats.size;
    const fileSizeInKb = fileSizeInBytes / 1000.0;

    // format the output file size to 2 decimal places and make it a string, and provide both kb and mb
    // and append with the size unit
    const fileSizeInKbString = fileSizeInKb.toFixed(2) + "kb";
    const fileSizeInMbString = (fileSizeInKb / 1000.0).toFixed(2) + "mb";

    console.log(fileSizeInKbString);
    console.log(fileSizeInMbString)


}

main();