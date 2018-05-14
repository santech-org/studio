const rollup = require('rollup');
const typescript = require('rollup-plugin-typescript2');
const builtins = require('rollup-plugin-node-builtins');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const json = require('rollup-plugin-json');

const buildModule = async () => {
  const plugins = [
    builtins(),
    commonjs(),
    json(),
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
  ];

  const bundle = await rollup.rollup({
    input: './index.js',
    plugins,
  });

  await bundle.write({
    file: 'dist/umd/index.js',
    format: 'umd',
    name: 'Santech.AnalyticsCore',
    sourcemap: true,
    sourcemapFile: 'dist/umd/index.js.map',
    strict: false,
  });
};

const buildTestingModule = async () => {
  const plugins = [typescript()];

  const testingBundle = await rollup.rollup({
    external: [
      '@santech/analytics-core',
      '@santech/core/testing',
    ],
    input: './index-testing.ts',
    plugins,
  });

  await testingBundle.write({
    file: 'dist/umd/index-testing.js',
    format: 'umd',
    globals: {
      '@santech/analytics-core': 'Santech.AnalyticsCore',
      '@santech/core/testing': 'Santech.Core.Testing',
    },
    name: 'Santech.AnalyticsCore.Testing',
    sourcemap: true,
    sourcemapFile: 'dist/umd/index-testing.js.map',
  });
};

buildModule();
buildTestingModule();
