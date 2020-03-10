import webpack from 'webpack'
import path from 'path'
import copyPlugin from 'copy-webpack-plugin'

const sourceRootPath = path.join(__dirname, 'src')
const distRootPath = path.join(__dirname, 'dist')

const config: webpack.Configuration = {
  mode: 'development',
  watch: true,
  entry: {
    watch: path.join(sourceRootPath, 'watch.ts')
  },
  output: {
    path: distRootPath,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new copyPlugin([{
      from: 'static',
      to: distRootPath
    }])
  ]
}

export default config
