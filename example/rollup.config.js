import babel from 'rollup-plugin-babel'

export default {
  entry: 'main.js',
  format: 'iife',
  plugins: [ babel() ],
  dest: 'bundle.js',
  globals: {
    ramda: 'R'
  }
}
