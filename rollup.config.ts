import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import json from "@rollup/plugin-json";
import css from "rollup-plugin-css-only";
import builtins from "rollup-plugin-node-builtins";
import replace from "@rollup/plugin-replace";

import typescript from "@rollup/plugin-typescript";
import autoPreprocess from "svelte-preprocess";

import dotenv from "dotenv";

if (!process.env.PROD) {
  dotenv.config();
}
if (!process.env.INFURA_API_KEY) {
  throw new Error("ENV variables not set!");
}
const production = false; // process.env.PROD;

const envKeys = () => {
  return Object.keys(process.env).reduce(
    (envValues, envValue) => ({
      ...envValues,
      [`process.env.${envValue}`]: JSON.stringify(process.env[envValue])
    }),
    {}
  );
};

const toRollupConfig = function (component) {
  return {
    // input: `svelte/${component}.svelte`,
    input: `svelte/main.js`,
    output: [
      {
        sourcemap: !production,
        format: "iife",
        name: component.replace(/-/g, "_"),
        // file: `app/build/${component}.js`
        file: `app/build/bundle.js`
      },
      {
        sourcemap: !production,
        format: "iife",
        name: component.replace(/-/g, "_"),
        file: `wordpress/kredeum-nfts/lib/js/${component}.js`
      }
    ],
    plugins: [
      svelte({
        preprocess: [autoPreprocess({})],
        compilerOptions: {
          // customElement: true,
          dev: !production
        }
      }),
      css({ output: "bundle.css" }),
      replace({
        preventAssignment: true,
        values: envKeys()
      }),
      typescript({ sourceMap: !production }),
      resolve({
        browser: true,
        dedupe: ["svelte"],
        preferBuiltins: false
      }),
      builtins(),
      json(),
      commonjs(),
      production && terser()
    ],
    watch: {
      clearScreen: false
    },
    onwarn: function (warning) {
      if (warning.code === "THIS_IS_UNDEFINED" || warning.code === "CIRCULAR_DEPENDENCY") {
        return;
      }
      console.warn(warning.message);
    }
  };
};

export default [
  // toRollupConfig("kredeum-metamask"),
  // toRollupConfig("kredeum-nft-mint")
  toRollupConfig("kredeum-nft")
];
