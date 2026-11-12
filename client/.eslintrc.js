module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/airbnb', '@vue/prettier'],
  rules: {
    'import/extensions': 0,
    'no-console': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-param-reassign': 0,
    'no-plusplus': 0,
    'vue/multi-word-component-names': 'off',
    camelcase: 0,
    'no-prototype-builtins': 0,
    'prefer-object-spread': 0,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
};
