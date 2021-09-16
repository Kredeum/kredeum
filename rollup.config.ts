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

const production = process.env.PROD;

const toRollupConfig = function (component, dest, customElement = true) {
  return {
    input: "svelte/" + component + (customElement ? ".svelte" : ".js"),
    output: {
      sourcemap: !production,
      format: "iife",
      name: component.replace(/-/g, "_"),
      file: `${dest}/${component}.js`
    },
    plugins: [
      // replace({
      //   preventAssignment: true,
      //   values: envKeys()
      // }),
      svelte({
        preprocess: [
          autoPreprocess({
            replace: [[/process\.env\.(\w+)/g, (_, prop) => JSON.stringify(process.env[prop])]]
          })
        ],
        compilerOptions: {
          customElement,
          dev: !production
        }
      }),
      replace({ "process.env.NODE_DEBUG": "false" }), // utils lib bug !
      typescript({ sourceMap: !production }),
      css({ output: `${dest}/${component}.css` }),
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
  // toRollupConfig("kredeum-metamask", "build"),
  // toRollupConfig("kredeum-nft-mint", "build")
  toRollupConfig("kredeum-nft", "app/build")
  // toRollupConfig("vide", "app/build")
];
