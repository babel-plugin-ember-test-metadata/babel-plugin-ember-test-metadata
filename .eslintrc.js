module.exports = {
  root: true,
  ignorePatterns: ['packages/workspace-template/**/*.js', 'packages/app-template/**/*.js'],
  env: {
    browser: false,
    node: true,
    es6: true,
  },
  plugins: ['node', 'prettier'],
  extends: ['eslint:recommended', 'plugin:node/recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['packages/**/__tests__/**/*.js'],
      env: {
        jest: true,
      },
    },
  ],
};
