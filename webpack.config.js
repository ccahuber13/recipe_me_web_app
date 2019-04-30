// Webpack - Entry point, output, loaders, plugins
// Loaders allow you to run differnet types of files, such as Saas to css or ES6 JS to ES5.

// Assigned require to path variable to run resolve method on.
const path = require('path');
const HtmlWebpackPlugin = require ('html-webpack-plugin');

{
    module.exports = {
        // Where it will start looking for all dependencies it should bundle. Polyfill adds ES6 features to ES5 which cannot be converted. Such as promises or .from
        entry: ['babel-polyfill','./src/js/index.js'],
        output: {
            // Coming our absoloute path with the one we want our bundle.js to appear in.
            path: path.resolve(__dirname, 'dist'),
            filename: 'js/bundle.js'
        },
        // production mode minifies code. Development does not to increase bundle speed.
        devServer: {
            contentBase: './dist'
        },
        // plugin to move changes from src index.html into production dist index.html file.
        // Creating a new class from the plugin and setting file and the template its coming from.
        plugins: [
            new HtmlWebpackPlugin(
                {
                    filename: 'index.html', 
                    template: './src/index.html'
                }
            )
        ],
        module: {
            // Rules with babel loader
            rules: [
                {
                    // look for all files and test if they end in .js - Using a reg expression
                    test: /\.js/,
                    // exclude this folder so it does not look through these javascript files
                    exclude: /node_modules/,
                    // if file tests yes for .js file, it applies babel-loader to those files. Babel ES6 -> ES5 code.
                    use: {
                        loader: 'babel-loader'
                    }
                }
            ]
        }
    };
}