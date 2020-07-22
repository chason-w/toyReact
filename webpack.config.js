/*
 * @Author: your name
 * @Date: 2020-07-20 20:25:08
 * @LastEditTime: 2020-07-21 22:45:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /toy-react/webpack.config.js
 */
module.exports = {
    entry: {
        main: './main.js'
    },
    mode: 'development',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [[
                            "@babel/plugin-transform-react-jsx",
                            {pragma: "ToyReact.createElement"}
                        ]]
                    }
                }
            }
        ]
    },
    optimization: {
        minimize: false
    }
}