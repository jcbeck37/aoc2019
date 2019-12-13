module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "no-underscore-dangle": ["error", { "allow": ["_id", "_parsedUrl"] }],
    "global-require": "off",
    "import/no-dynamic-require": "off",
    "import/no-extraneous-dependencies": "warn",
    "indent": ["error", 2],
    "func-names": "off",
    "no-bitwise": ["warn"],
    "no-console": "off",
    "no-use-before-define": ["off"],
    "no-unused-vars": ["warn", { "vars": "all" }],
    "prefer-promise-reject-errors": "warn"
  },
};
