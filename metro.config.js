// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const path = require('path');

module.exports = getDefaultConfig(__dirname, {
  resolver: {
    blockList: exclusionList([/node_modules\/.*\/node_modules\/react-native\/.*/]),
  },
});
