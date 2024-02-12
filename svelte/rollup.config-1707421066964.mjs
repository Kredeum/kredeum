import svelte from 'rollup-plugin-svelte';
import preprocess from 'svelte-preprocess';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import image from '@rollup/plugin-image';
import typescript from '@rollup/plugin-typescript';

const logs = new Map();
if (!process.env.ENVIR) {
    throw new Error("ENV Variable ENVIR not set!");
}
const production = process.env.ENVIR == "PROD";
console.info("production", production);
const toRollupConfig = function () {
    return {
        input: ["src/app.ts"],
        output: [
            {
                sourcemap: true,
                format: "iife",
                file: "./web/dapp/assets/js/kredeum-nfts.js"
            }
        ],
        plugins: [
            svelte({
                preprocess: [preprocess({})],
                compilerOptions: { dev: !production }
            }),
            postcss({
                extract: true
            }),
            nodeResolve({
                browser: true,
                dedupe: ["svelte"],
                preferBuiltins: false
            }),
            typescript({ sourcemap: true, build: true }),
            image(),
            json(),
            commonjs(),
            production && terser()
        ],
        watch: {
            clearScreen: false
        },
        onwarn: (warning) => {
            warning.code || (warning.code = "NO_WARNING_CODE");
            if (logs.get(warning.code))
                return;
            logs.set(warning.code, true);
            console.warn(warning.code, warning.message);
        }
    };
};
var rollup_config = [toRollupConfig()];

export { rollup_config as default };
