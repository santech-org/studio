const rollup = require('rollup');
const typescript = require('rollup-plugin-typescript2');

const plugins = [typescript()];

const buildModule = async () => {
  const bundle = await rollup.rollup({
    external: [
      '@santech/common',
      '@santech/core',
      '@stomp/stompjs',
      '@types/sockjs-client',
      'sockjs-client',
    ],
    input: './index.ts',
    plugins,
  });

  await bundle.write({
    file: 'dist/umd/index.js',
    format: 'umd',
    globals: {
      '@santech/common': 'Santech.Common',
      '@santech/core': 'Santech.Core',
      '@stomp/stompjs': '',
      '@types/sockjs-client': '',
      'sockjs-client': '',
    },
    name: 'Santech.Websocket',
    sourcemap: true,
    sourcemapFile: 'dist/umd/index.js.map',
  });
};

const buildTestingModule = async () => {
  const testingBundle = await rollup.rollup({
    external: [
      '@santech/core/testing',
      '@santech/websocket',
    ],
    input: './index-testing.ts',
    plugins,
  });

  await testingBundle.write({
    file: 'dist/umd/index-testing.js',
    format: 'umd',
    globals: {
      '@santech/core/testing': 'Santech.Core.Testing',
      '@santech/websocket': 'Santech.Websocket',
    },
    name: 'Santech.Websocket.Testing',
    sourcemap: true,
    sourcemapFile: 'dist/umd/index-testing.js.map',
  });
};

buildModule();
buildTestingModule();
