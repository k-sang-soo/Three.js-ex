const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        index: './src/index.js',
        ex01: './src/ex01.js',
        ex02: './src/ex02.js',
        ex03: './src/ex03.js',
        ex04: './src/ex04.js',
        ex05: './src/ex05.js',
        ex06: './src/ex06.js',
        ex07: './src/ex07.js',
        ex08: './src/ex08.js',
        ex09: './src/ex09.js',
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name]_bundle.js',
    },
    performance: {
        maxEntrypointSize: 1024000,
        maxAssetSize: 1024000,
    },
    devServer: {
        publicPath: '/public/',
        compress: true,
        port: 9000,
        hot: true,
        inline: true,
    },
    watchOptions: {
        poll: true,
        ignored: '/node_modules/',
    },
};
