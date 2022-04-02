import {terser} from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'
import pluginCommonjs from "@rollup/plugin-commonjs";
import pkg from './package.json'

const banner = `
/*

${pkg.name} v${pkg.version}
${pkg.repository.url}

Copyright (c) ${pkg.author.name}

This source code is licensed under the ${pkg.license} license found in the
LICENSE file in the root directory of this source tree.

@bannerend*/
`

const external = [...Object.keys(pkg.dependencies || {})]
const plugins = [
  typescript({
    typescript: require('typescript'),
  }),
  pluginCommonjs({
    extensions: [".js", ".ts"]
  })
]

if(!process.env.ROLLUP_WATCH)
   plugins.push(terser({
    format: {
      comments: function (node, comment) {
        if (comment.type === 'comment2') {
          return /@bannerend/i.test(comment.value)
        }
      },
    },
  }))

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        banner,
        exports: "default"
      },
      {
        file: pkg.module,
        format: 'es', // the preferred format
        banner,
      },
      {
        file: pkg.browser,
        format: 'umd',
        name: 'DSA', // the global which can be used in a browser
        banner,
      }
    ],
    external,
    plugins,
  }
]
