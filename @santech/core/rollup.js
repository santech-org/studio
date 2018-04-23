const rollup = require('rollup');
const typescript = require('rollup-plugin-typescript2');

const plugins = [typescript()];

const buildModule = async () => {
  const bundle = await rollup.rollup({
    input: './index.ts',
    plugins,
  });

  await bundle.write({
    file: 'dist/umd/index.js',
    format: 'umd',
    name: 'Santech.Core',
    sourcemap: true,
    sourcemapFile: 'dist/umd/index.js.map',
  });
};

const buildTestingModule = async () => {
  const testingBundle = await rollup.rollup({
    external: ['@santech/core'],
    input: './index-testing.ts',
    plugins,
  });

  await testingBundle.write({
    file: 'dist/umd/index-testing.js',
    format: 'umd',
    globals: {
      '@santech/core': 'Santech.Core',
    },
    name: 'Santech.Core.Testing',
    sourcemap: true,
    sourcemapFile: 'dist/umd/index-testing.js.map',
  });
};

buildModule();
buildTestingModule();
