// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';

export default {
  output: {
    file: 'dist/index.js',
    format: 'umd'
  },
  plugins: [ resolve() ]
};
