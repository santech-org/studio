const rollup = require('rollup');
const typescript = require('rollup-plugin-typescript2');

const plugins = [typescript()];

const buildModule = async () => {
  const bundle = await rollup.rollup({
    external: ['@santech/core'],
    input: './src/index.ts',
    plugins,
  });

  await bundle.write({
    file: 'dist/umd/index.js',
    format: 'umd',
    globals: {
      '@santech/core': 'Santech.Core',
    },
    name: 'Santech.Common',
    sourcemap: true,
    sourcemapFile: 'dist/umd/index.js.map',
  });
};

const buildTestingModule = async () => {
  const testingBundle = await rollup.rollup({
    external: ['@santech/common', '@santech/core/testing'],
    input: './src/index-testing.ts',
    plugins,
  });

  await testingBundle.write({
    file: 'dist/umd/index-testing.js',
    format: 'umd',
    globals: {
      '@santech/common': 'Santech.Common',
      '@santech/core/testing': 'Santech.Core.Testing',
    },
    name: 'Santech.Common.Testing',
    sourcemap: true,
    sourcemapFile: 'dist/umd/index-testing.js.map',
  });
};

buildModule();
buildTestingModule();
