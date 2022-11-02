module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    project: ["./tsconfig.json"],
    tsconfigRootDir: __dirname
  },
  env: {
    es6: true,
    browser: true,
    node: true
  },
  ignorePatterns: ["node_modules"],
  rules: {
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-unsafe-argument": "warn",
    "@typescript-eslint/no-misused-promises": "warn",
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/no-floating-promises": "warn",
    "@typescript-eslint/restrict-template-expressions": "warn",
    "@typescript-eslint/no-unsafe-return": "warn",
    "@typescript-eslint/ban-types": "warn",
    "@typescript-eslint/require-await": "warn",
    indent: ["error", 2],
    semi: ["error", "always"],
    quotes: ["error", "double"],
    "no-global-assign": [
      "error",
      {
        exceptions: ["require"]
      }
    ]
  },
  globals: {
    ethereum: "readonly"
  }
};
