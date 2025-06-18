import { defineConfig } from '@rslib/core';

export default defineConfig({
  source: {
    entry: {
      'orchard-ui': './src/index.ts',
    },
  },
  lib: [
    {
      format: 'esm',
      syntax: 'es2021',
      dts: true,
    },
  ],
  output: {
    sourceMap: {
      js: 'inline-cheap-source-map',
    },
  },
});
