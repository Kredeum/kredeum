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

const envKeys = () => {
  const envRaw = dotenv.config().parsed || {};
  return Object.keys(envRaw).reduce(
    (envValues, envValue) => ({
      ...envValues,
      [`process.env.${envValue}`]: JSON.stringify(envRaw[envValue])
    }),
    {}
  );
};
const production = process.env.PROD;

const toRollupConfig = function (component) {
  return {
    input: `svelte/${component}.svelte`,
    output: [
      {
        sourcemap: !production,
        format: "iife",
        name: component.replace(/-/g, "_"),
        file: `app/build/${component}.js`
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
          customElement: true,
          dev: !production
        }
      }),
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
      css(),
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
