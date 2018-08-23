const rollup = require('rollup');
const typescript = require('rollup-plugin-typescript2');

const plugins = [typescript()];

const buildModule = async () => {
  const bundle = await rollup.rollup({
    external: [
      '@santech/analytics-core',
      '@santech/common',
      '@santech/core',
    ],
    input: './src/index.ts',
    plugins,
  });

  await bundle.write({
    file: 'dist/umd/index.js',
    format: 'umd',
    globals: {
      '@santech/analytics-core': 'Santech.AnalyticsCore',
      '@santech/common': 'Santech.Common',
      '@santech/core': 'Santech.Core',
    },
    name: 'Santech.AnalyticsIntegration',
    sourcemap: true,
    sourcemapFile: 'dist/umd/index.js.map',
  });
};

const buildTestingModule = async () => {
  const testingBundle = await rollup.rollup({
    external: [
      '@santech/analytics-integration',
      '@santech/core/testing',
    ],
    input: './src/index-testing.ts',
    plugins,
  });

  await testingBundle.write({
    file: 'dist/umd/index-testing.js',
    format: 'umd',
    globals: {
      '@santech/analytics-integration': 'Santech.AnalyticsIntegration',
      '@santech/core/testing': 'Santech.Core.Testing',
    },
    name: 'Santech.AnalyticsIntegration.Testing',
    sourcemap: true,
    sourcemapFile: 'dist/umd/index-testing.js.map',
  });
};

buildModule();
buildTestingModule();
