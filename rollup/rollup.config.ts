import type { RollupOptions, Plugin } from "rollup";

import svelte from "rollup-plugin-svelte";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
// import _css from "rollup-plugin-css-only";
import _postcss from "rollup-plugin-postcss";
import _builtins from "rollup-plugin-node-builtins";

import typescript from "@rollup/plugin-typescript";
import sveltePreprocess from "svelte-preprocess";

import dotenv from "dotenv";
import findupSync from "findup-sync";

const builtins = _builtins as { (): Plugin };
// const css = _css as { (Options): Plugin };
const postcss = _postcss as { (Options): Plugin };

dotenv.config({ path: findupSync(".env") || "" });
if (!process.env.ENVIR) {
  throw new Error("ENV Variable ENVIR not set!");
}
const production = process.env.ENVIR == "PROD";
console.log("production", production);

const envKeys = () => {
  return Object.keys(process.env).reduce(
    (envValues, envValue) => ({
      ...envValues,
      [`process.env.${envValue}`]: JSON.stringify(process.env[envValue])
    }),
    {}
  );
};

const toRollupConfig = function (component: string): RollupOptions {
  return {
    input: ["./svelte/main.ts"],
    output: [
      {
        sourcemap: !production,
        format: "iife",
        name: component.replace(/-/g, "_"),
        file: `../web/dapp/assets/${component}.js`
      },
      {
        sourcemap: !production,
        format: "iife",
        name: component.replace(/-/g, "_"),
        file: `../wordpress/plugins/kredeum-nfts/lib/js/${component}.js`
      }
    ],
    plugins: [
      svelte({
        preprocess: [sveltePreprocess({})],
        compilerOptions: {
          customElement: false,
          dev: !production
        }
      }),
      // css({ output: `${component}.css` }),
      postcss({
        extract: true
      }),
      replace({
        preventAssignment: true,
        values: envKeys()
      }),
      typescript({ sourceMap: !production, inlineSources: !production }),
      nodeResolve({
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
    onwarn: function (warning: { code: string; message: string }): void {
      if (warning.code === "THIS_IS_UNDEFINED" || warning.code === "CIRCULAR_DEPENDENCY") {
        return;
      }
      console.warn(warning.message);
    }
  };
};

export default [toRollupConfig("kredeum-nfts")];
