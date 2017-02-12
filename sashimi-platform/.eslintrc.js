module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "airbnb-base"
  ],
  "parserOptions": {
    "sourceType": "module"
  },
  "rules": {
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
    "no-console": "off",
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
    "quotes": "off",
    "space-before-function-paren": [
      "error", 
      {
        "anonymous": "never",
        "named": "never",
        "asyncArrow": "ignore"
      }
    ],
    eqeqeq: ["error", "smart"]
  }
};