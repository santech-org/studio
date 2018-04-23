import builtins from 'rollup-plugin-node-builtins';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';

export default {
  input: './index.js',
  output: {
    file: 'dist/umd/index.js',
    format: 'umd',
    name: 'Santech.AnalyticsCore',
    sourcemap: true,
    sourcemapFile: 'dist/umd/index.js.map',
    strict: false,
  },
  plugins: [
    builtins(),
    commonjs(),
    json(),
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
  ],
};
