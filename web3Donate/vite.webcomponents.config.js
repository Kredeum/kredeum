import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig( {
    build: {
        lib: {
            entry: resolve( __dirname, 'src/lib/indexToJS.ts' ),
            name: 'web3Donate',
            fileName: 'web3Donate',
            formats: [ 'iife' ]
        },
        outDir: 'dist-js-web3Donate',
    },
    plugins: [ svelte() ]
} );