module.exports = {
  env: {
    browser: false,
    node: true,
  },
  plugins: ['node', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'script',
  },
  rules: {},
};
