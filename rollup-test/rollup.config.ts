import type { RollupOptions } from "rollup";

import svelte from "rollup-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";

import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import image from "@rollup/plugin-image";
import commonjs from "@rollup/plugin-commonjs";
// import terser from "@rollup/plugin-terser";

const prod = process.env.ENVIR == "PROD";
console.log("prod", prod);

const config: RollupOptions = {
  input: "src/main.ts",
  output: {
    name: "dapp",
    file: "web/js/dapp.js",
    format: "iife",
    // sourcemap: !prod,
  },
  plugins: [
    svelte({
      preprocess: [sveltePreprocess({})],
      compilerOptions: {
        dev: !prod
      },
    }),
    postcss(),
    nodeResolve(),
    typescript(),
    image(),
    json(),
    commonjs(),
    // prod && terser(),
  ],
};

export default config;
