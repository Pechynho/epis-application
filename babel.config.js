module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.js', '.json'],
        alias: {
          Screen: './src/Screen',
          Component: './src/Component',
          Config: './src/Config',
        },
      },
    ],
  ],
};
