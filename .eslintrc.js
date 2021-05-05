module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true
  },
  'plugins': ['svelte3'],
  'extends': [
    'eslint:recommended',
  ],
  'parserOptions': {
    'ecmaVersion': 2021,
    'sourceType': 'module'
  },
  'overrides': [
    {
      'files': ['**/*.svelte'],
      'processor': 'svelte3/svelte3'
    }
  ],
  'rules': {
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'space-before-function-paren': ['error', 'always'],
    'no-global-assign': ['error', { 'exceptions': ['require'] }],
    'spaced-comment': 'off',
    'missing-custom-element-compile-options': 0
  },
  'settings': {
    'svelte3/compiler-options': {
      'customElement': true
    },

    'svelte3/ignore-warnings': warning =>
      warning.code === 'missing-custom-element-compile-options'
  },
  'globals': {
    'ethereum': 'readonly'
  }
};