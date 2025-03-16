const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {

    return {
        entry: path.join(__dirname, "src", "index.js"), // Entry point of your application
        output: {
            path: path.resolve(__dirname, "dist"), // Output directory
            filename: argv.mode === 'production' ? "[name].[contenthash].js" : "[name].js", // Output bundle file name
        },
        devtool: 'inline-source-map',
        module: {
            rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                },
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                // Creates `style` nodes from JS strings
                "style-loader",
                // Translates CSS into CommonJS
                "css-loader",
                // Compiles Sass to CSS
                "sass-loader"
                ],
            },
            {
                test: /\.(png|jp(e*)g|svg|gif|eot|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                        outputPath: 'images',
                        },
                    },
                ]
            },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.join(__dirname, "public", "index.html"),
                filename: 'index.html',
            }),
        ],
        resolve: {
            fallback: {
                "path": require.resolve("path-browserify"),
                "buffer": require.resolve("buffer/"),
                "process": require.resolve("process/browser"),
                "stream": require.resolve("stream-browserify"),
                "crypto": require.resolve("crypto-browserify"),
            },
            extensions: [".js", ".jsx"],
        },
        devServer: {
            static: './dist',
            hot: true,
            liveReload: true,
            client: {
                overlay: {
                    errors: true,
                    warnings: true,
                    runtimeErrors: true,
                }
            },
        },
        optimization: {
            runtimeChunk: 'single',
        },
        externals: {
            '@mapbox/node-pre-gyp': 'commonjs @mapbox/node-pre-gyp'
        }
    };
};