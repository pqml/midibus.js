import nodeResolve from 'rollup-plugin-node-resolve'
import config from './rollup.config.js'

config.plugins[0] = (
  nodeResolve({
    main: true,
    module: true,
    browser: true,
    skip: [],
    extensions: ['.js', '.json']
  }))

config.targets = [
  {
    format: 'umd',
    dest: 'build/midibus.umd.js',
    moduleName: 'midibus'
  }
]

export default config
