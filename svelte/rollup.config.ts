import type { RollupOptions, RollupLog } from "rollup";

import svelte from "rollup-plugin-svelte";
import preprocess from "svelte-preprocess";
import postcss from "rollup-plugin-postcss";

import terser from "@rollup/plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import image from "@rollup/plugin-image";

import typescript from "@rollup/plugin-typescript";

const logs: Map<string, boolean> = new Map();

if (!process.env.ENVIR) {
  throw new Error("ENV Variable ENVIR not set!");
}
const production = process.env.ENVIR == "PROD";
console.info("production", production);

const toRollupConfig = function (): RollupOptions {
  return {
    input: ["src/app.ts"],
    output: [
      {
        // sourcemap: true,
        format: "iife",
        experimentalMinChunkSize: 100_000,
        file: "./web/dapp/assets/js/kredeum-nfts.js"
        // inlineDynamicImports: true
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
