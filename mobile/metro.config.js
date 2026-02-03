const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const path = require('path');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.watchFolders = [__dirname];
config.resolver = {
    ...config.resolver,
    blockList: exclusionList([
        new RegExp(path.join(__dirname, '..', 'server', 'node_modules') + '/.*'),
        new RegExp(path.join(__dirname, '..', 'server', 'dist') + '/.*'),
        new RegExp(path.join(__dirname, '..', 'server') + '/.*'),
        new RegExp(path.join(__dirname, '.git') + '/.*'),
        new RegExp(path.join(__dirname, '.expo') + '/.*'),
        new RegExp(path.join(__dirname, '.cache') + '/.*')
    ])
};

module.exports = withNativeWind(config, { input: './src/styles/index.css' });