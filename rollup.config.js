import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'

const rollupConfig = {
  entry: 'src/midi.js',
  plugins: [
    nodeResolve({
      main: true,
      module: true,
      browser: true,
      skip: ['mitt'],
      extensions: ['.js', '.json']
    }),
    commonjs({}),
    babel({
      exclude: 'node_modules/**'
    })
  ],
  targets: [
    {
      format: 'cjs',
      dest: 'build/midibus.js'
    },
    {
      format: 'es',
      dest: 'build/midibus.es.js'
    }
  ],
  indent: '  ',
  sourceMap: false
}

export default rollupConfig
