/**
 * Rollup config
 *
 * This script config allows us to create a bundle of the library
 * the library is meant to be used at ES module, or <script type="module" src"">
 *
 * intall:
 * > npm install -g rollup
 *
 * run
 * > rollup -c
 */
const terser = require('rollup-plugin-terser');
import banner from 'rollup-plugin-banner';
const pkg = require('./package.json');

const topBanner = `${pkg.pkgName} ${pkg.version}
${pkg.homepage}
`;

export default {
  input: './src/index.js',
  output: {
    file: './dist/litestate.esm.js',
    format: 'esm',
  },
  plugins: [terser.terser(), banner(topBanner)],
};
