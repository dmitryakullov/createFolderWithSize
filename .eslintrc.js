const NO_ERROR = 0;

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
    'linebreak-style': NO_ERROR,
    camelcase: NO_ERROR,
    'no-use-before-define': NO_ERROR,
    'operator-linebreak': NO_ERROR,
    'no-plusplus': NO_ERROR,
    'no-console': NO_ERROR,
    'comma-dangle': NO_ERROR,
    'object-curly-newline': NO_ERROR,
    'no-await-in-loop': NO_ERROR,
    'max-len': ['error', { code: 100 }],
  },
};
