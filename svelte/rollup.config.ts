import type { RollupOptions, RollupLog } from "rollup";

import svelte from "rollup-plugin-svelte";
import preprocess from "svelte-preprocess";
import postcss from "rollup-plugin-postcss";

import terser from "@rollup/plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import image from "@rollup/plugin-image";
import replace from "@rollup/plugin-replace";

import typescript from "@rollup/plugin-typescript";

const logs: Map<string, boolean> = new Map();

if (!process.env.ENVIR) {
  throw new Error("ENV Variable ENVIR not set!");
}
const production = process.env.ENVIR == "PROD";
console.info("production", production);

const envKeysValues = {
  GIT_BRANCH: process.env["GIT_BRANCH"] || "",
  GIT_SHORT: process.env["GIT_SHORT"] || ""
};
console.log("envKeysValues", JSON.stringify(envKeysValues, null, 2));

const toRollupConfig = function (): RollupOptions {
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
      replace({
        preventAssignment: true,
        values: envKeysValues
      }),
      nodeResolve({
        browser: true,
        dedupe: ["svelte"],
        preferBuiltins: false
      }),
      typescript(),
      image(),
      json(),
      commonjs(),
      production && terser()
    ],
    watch: {
      clearScreen: false
    },

    onwarn: (warning: RollupLog) => {
      warning.code ||= "NO_WARNING_CODE";

      if (logs.get(warning.code)) return;
      logs.set(warning.code, true);

      console.warn(warning.code, warning.message);
    }
  };
};

export default [toRollupConfig()];
