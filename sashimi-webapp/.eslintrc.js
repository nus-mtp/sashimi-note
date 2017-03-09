// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  'rules': {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    "indent": [
      "error", 2, 
      { "SwitchCase": 1 }
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-console": "warn",
    "linebreak-style": "off",
    "max-len": [
      "warn", 120, 2, 
      { ignoreComments: true }
    ],
    "quote-props": [
      "warn",
      "consistent-as-needed"
    ],
    "no-cond-assign": [
      "off",
      "except-parens"
    ],
    "radix": "off",
    "space-infix-ops": "off",
    "no-unused-vars": [
      "warn", 
      {
        "vars": "local", 
        "args": "none", 
        "argsIgnorePattern": "next" 
      }
    ],
    "default-case": "error",
    "no-else-return": "off",
    "no-param-reassign": "off",
    "space-before-function-paren": [
      "warn", 
      {
        "anonymous": "never",
        "named": "never",
        "asyncArrow": "ignore"
      }
    ],
    "eqeqeq": ["error", "smart"],
    "comma-dangle": "off",
    "func-names": "warn",
    "prefer-arrow-callback": "warn",
    "object-shorthand": "warn",
    "prefer-const": "warn",
    "arrow-body-style": "warn",
  }
}
