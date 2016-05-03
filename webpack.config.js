module.exports = {
    entry: [
        "./src/index.js",
        'webpack-dev-server/client?http://localhost:8080'
    ],
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/, exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ['es2015', 'react', 'stage-0']
                }
            },
            { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
        ]
    }
};
