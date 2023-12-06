module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'linebreak-style': 0,
    camelcase: 0,
    'no-use-before-define': 0,
    'operator-linebreak': 0,
    'no-plusplus': 0,
    'no-console': 0,
    'comma-dangle': 0,
  },
};
