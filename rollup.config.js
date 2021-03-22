import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import css from 'rollup-plugin-css-only';
// import nodePolyfills from 'rollup-plugin-node-polyfills';
import builtins from 'rollup-plugin-node-builtins';

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    }
  };
}

const toRollupConfig = function (component, customElement = true, dest = 'app/build') {
  return {
    input: 'svelte/' + component + (customElement ? '.svelte' : '.js'),
    output: {
      sourcemap: true,
      format: 'iife',
      name: component,
      file: `${dest}/${component}.js`
    },
    plugins: [
      svelte({
        compilerOptions: {
          customElement,
          dev: !production,
        },
      }),
      css({ output: `${component}.css` }),
      resolve({
        browser: true,
        dedupe: ['svelte'],
        preferBuiltins: false
      }),
      // nodePolyfills(),
      builtins(),
      json(),
      commonjs(),
      !production && serve(),
      !production && livereload('public'),
      production && terser()
    ],
    watch: {
      clearScreen: false
    },
    onwarn: function (warning) {
      if (warning.code === 'THIS_IS_UNDEFINED') { return; }
      console.warn(warning.message);
    }
  }
};

export default [
  // toRollupConfig('kredeum_nft', false, 'app/build'),
  toRollupConfig('kredeum_nft'),
  toRollupConfig('kredeum_nft_mint'),
  toRollupConfig('kredeum_metamask')
];
