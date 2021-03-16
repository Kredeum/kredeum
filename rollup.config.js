import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';


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

const toRollupConfig = function (component, dest = 'public/build', customElement = false) {
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
        dedupe: ['svelte']
      }),
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
  toRollupConfig('kredeum'),
  toRollupConfig('metamask', 'wordpress/test-ajax', true)
];
