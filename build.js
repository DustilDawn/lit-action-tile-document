import esbuild from 'esbuild';
import fs from 'fs';
async function main() {
    await esbuild.build({
        entryPoints: ['./index.js'],
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

    data = data.replace("__________INPUT_CONTENT__________", 'content');

    data = data.replace('[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]', 'seed')

    // write the file
    fs.writeFileSync('./dist/tile-action.js', data, 'utf8');

}

main();