import esbuild from 'esbuild';
import fs from 'fs';

async function main() {
    await esbuild.build({
        entryPoints: ['./tile-action.js'],
        sourceRoot: "./",
        globalName: 'tileAction',
        bundle: true,
        minify: true,
        outfile: './dist/tile-action.js',
        define: {
            "Buffer": "global.Buffer"
        }
    });

    // read the file
    let data = fs.readFileSync('./dist/tile-action.js', 'utf8');

    data = data.replace('"__________INPUT_CONTENT__________"', 'content');

    data = data.replace('[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]', 'seed')

    data = data.replace('"https://node1.orbis.club/"', 'host');

    // write the file
    fs.writeFileSync('./dist/tile-action.js', data, 'utf8');

    const stats = fs.statSync('./dist/tile-action.js');
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