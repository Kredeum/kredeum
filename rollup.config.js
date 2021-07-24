import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import json from "@rollup/plugin-json";
import css from "rollup-plugin-css-only";
import builtins from "rollup-plugin-node-builtins";

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
      svelte({
        compilerOptions: {
          customElement,
          dev: !production
        }
      }),
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
      if (warning.code === "THIS_IS_UNDEFINED") {
        return;
      }
      console.warn(warning.message);
    }
  };
};

export default [
  // toRollupConfig("kredeum-metamask", "app/build"), // app/metamask.html
  // toRollupConfig("kredeum-nft-mint", "app/build"), // app/mint.html
  toRollupConfig("kredeum-nft", "app/build")
];
