const { addBeforeLoader, loaderByName } = require('@craco/craco');

module.exports = {
    plugins: [
        {
            plugin: require('craco-styled-jsx'),
            options: {
                sass: true, // Required node-sass to enable this option
                cssFileSupport: true, // Allow to write css in a standalone file
                cssFileTest: /\.styled\.(s)css$/,
            }
        },
    ],
    webpack: {
        configure: {
            module: {
                rules: [
                    {
                        test: /\.mjs$/,
                        include: /node_modules/,
                        type: "javascript/auto"
                    }
                ]
            }
        }
    },
    babel: {
        plugins: [
            '@babel/plugin-proposal-optional-chaining'
            ,'@babel/plugin-proposal-nullish-coalescing-operator'
            ,["@babel/plugin-proposal-private-methods", { "loose": true }]
            ,["@babel/plugin-proposal-class-properties", { "loose": true }]
            ,["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
        ],
        presets: ['@babel/preset-env']
    },

}