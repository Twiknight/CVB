import babel from 'rollup-plugin-babel'

export default {
  entry: 'main.js',
  format: 'iife',
  plugins: [ babel({
    presets: ['es2015-rollup'],
    exclude: 'node_modules/**'
  }) ],
  dest: 'bundle.js',
  globals: {
    ramda: 'R'
  }
}
