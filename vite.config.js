// import dotenv from 'dotenv';
import { defineConfig } from 'vite';
import inject from '@rollup/plugin-inject';
// import { viteStaticCopy } from 'vite-plugin-static-copy'

// dotenv.config();

export default defineConfig({
  root: './',
  build: {
    outDir:'./dist',
    lib: {
      entry: './src/app.js',
      name: 'bpmn-modeler-customed',
      format: ['es']
    }
  },
  // publicDir: './assets/',
  plugins: [
    // Add it first
    inject({
        $: 'jquery',
        Popper: ['popper.js', 'default'] 
    }),
  ],  
})
