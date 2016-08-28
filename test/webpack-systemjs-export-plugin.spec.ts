import test from 'ava';

import * as fs from 'fs';
import * as path from 'path';
import * as webpack from 'webpack';

import WebpackSystemJSExportPlugin from '../src/webpack-systemjs-export-plugin';

var config = require('./example/webpack.config.js');

test('SystemJS is bundled with the correct chunk', async t => {

  let c = Object.assign({}, config, {
    plugins: [
      new WebpackSystemJSExportPlugin({
        bundleSystemJS: 'vendor'
      })]
  });

  let wp = await new Promise<string>((res, rej) => {
    webpack(c, (err, stats) => {  
      if (err)
        rej(err.message);
    })
      .run((err, stats) => {
        if (err)
          t.fail(err.message);
          let vendorBuildPath = path.join(config.output.path, 'vendor.min.js');
          let vendorHasSystem = fs.readFileSync(vendorBuildPath).toString().includes('SystemJS');
          if (vendorHasSystem)
            res('Vendor has SystemJS bundled!');
      });
  })
  .then((res) => t.pass(res))
  .catch((err) => t.fail(err));
});

test('External modules not found in built chunks', t => {
  var c = Object.assign({}, config,
    {
      plugins: [
        new WebpackSystemJSExportPlugin({
          externals: ['three']
        })]
    });
  t.fail();
});

test('Public `node_modules` accessable to SystemJS', t => {
  var c = Object.assign({}, config,
    {
      plugins: [
        new WebpackSystemJSExportPlugin({
          public: ['lodash']
        })
      ]
    });
  t.fail();
});

test('Custom chunk aliases accessable by SystemJS', t => {
  var c = Object.assign({}, config,
    {
      plugins: [
        new WebpackSystemJSExportPlugin({
          register: [{
            name: 'dynamic',
            alias: (chunk) => `myapp/${chunk}`
          }]
        })
      ]
    });
  t.fail();
});

test('All features work when minification is on', t => {
  t.fail();
});