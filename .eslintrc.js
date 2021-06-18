module.exports = {
  env: {
    browser: false,
    node: true
  },
  plugins: ['node'],
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'script'
  },
  rules: {},
}
