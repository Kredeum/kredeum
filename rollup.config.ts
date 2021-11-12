import { RollupOptions, Plugin } from "rollup";
import svelte from "rollup-plugin-svelte";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import _css from "rollup-plugin-css-only";
import _builtins from "rollup-plugin-node-builtins";

import typescript from "@rollup/plugin-typescript";
import autoPreprocess from "svelte-preprocess";

import dotenv from "dotenv";

const builtins = _builtins as { (): Plugin };
const css = _css as { (Options): Plugin };

if (process.env.ENVIR === undefined) {
  dotenv.config();
}
if (!process.env.INFURA_API_KEY) {
  throw new Error("ENV variables not set!");
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
    // input: `svelte/${component}.svelte`,
    input: ["svelte/main.js"],
    output: [
      {
        sourcemap: !production,
        format: "iife",
        name: component.replace(/-/g, "_"),
        file: `web/app/assets/${component}.js`
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
          customElement: false,
          dev: !production
        }
      }),
      css({ output: `${component}.css` }),
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
