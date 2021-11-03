import svelte from "rollup-plugin-svelte";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import json from "@rollup/plugin-json";
import css from "rollup-plugin-css-only";
import builtins from "rollup-plugin-node-builtins";
import replace from "@rollup/plugin-replace";

import typescript from "@rollup/plugin-typescript";
import autoPreprocess from "svelte-preprocess";

import dotenv from "dotenv";

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

const outputToPath = (path) => {
  return {
    sourcemap: !production,
    format: "iife",
    name: "kredeum-nfts.js",
    file: `${path}/kredeum-nfts.js`
  };
};
const svelteOptions = (customElement = false) => {
  const options = {
    preprocess: [autoPreprocess({})],
    compilerOptions: {
      customElement,
      dev: !production
    },
    include: "**",
    exclude: ""
  };
  if (customElement) {
    options.include = "**/*.wc.svelte/";
  } else {
    options.include = "**/*.svelte";
    options.exclude = "**/*.wc.svelte/";
  }
  return options;
};

export default {
  input: "svelte/index.js",
  output: [outputToPath("web/app/assets/"), outputToPath("wordpress/kredeum-nfts/lib/js/")],
  plugins: [
    svelte(svelteOptions(true)),
    svelte(svelteOptions(false)),
    css({ output: "kredeum-nfts.css" }),
    replace({
      preventAssignment: true,
      values: envKeys()
    }),
    typescript({ sourceMap: !production }),
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
  onwarn: function (warning) {
    if (warning.code === "THIS_IS_UNDEFINED" || warning.code === "CIRCULAR_DEPENDENCY") {
      return;
    }
    console.warn(warning.message);
  }
};
