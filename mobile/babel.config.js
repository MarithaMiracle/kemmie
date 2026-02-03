const cssInterop = require('react-native-css-interop/babel');

module.exports = function(api) {
    api.cache(true);
    const cssInteropPlugins = (cssInterop().plugins || []).filter(
        (plugin) => plugin !== 'react-native-worklets/plugin'
    );
    return {
        presets: [
            ['babel-preset-expo', { jsxImportSource: 'nativewind' }]
        ],
        plugins: [...cssInteropPlugins, 'react-native-reanimated/plugin']
    };
};