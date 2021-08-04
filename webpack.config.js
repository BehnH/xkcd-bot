const { DefinePlugin } = require("webpack");
const env = require("dotenv")

module.exports = {
    entry: './src/bot.js',
    plugins: [
        // Expose our environment in the worker
        new DefinePlugin(Object.entries(env.parsed).reduce((obj, [ key, val ]) => {
            obj[`process.env.${key}`] = JSON.stringify(val);
            return obj;
        }, { 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) })),
    ],
    module: {
        rules: [
            {
                test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader',
            },
        ],
    }
}