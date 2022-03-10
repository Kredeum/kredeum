module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["svelte3", "@typescript-eslint"],
  extends: [
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
    extraFileExtensions: [".svelte"]
  },
  env: {
    es6: true,
    browser: true,
    node: true
  },
  overrides: [
    {
      files: ["*.svelte"],
      processor: "svelte3/svelte3",
      rules: {
        "no-console": 0
      }
    }
  ],
  settings: {
    "svelte3/typescript": require("typescript"),
    // ignore style tags in Svelte because of Tailwind CSS
    // See https://github.com/sveltejs/eslint-plugin-svelte3/issues/70
    "svelte3/ignore-styles": () => true
  },
  ignorePatterns: ["node_modules", "**/vendor/*.js"],
  rules: {
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-unsafe-argument": "warn",
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/restrict-template-expressions": "warn",
    "@typescript-eslint/no-unsafe-return": "warn",
    "@typescript-eslint/ban-types": "warn",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/require-await": "error",
    "@typescript-eslint/no-misused-vars": "error",
    "@typescript-eslint/prefer-for-of": "error",
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
