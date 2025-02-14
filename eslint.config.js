import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import jsdoc from "eslint-plugin-jsdoc";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";

export default [
  js.configs.recommended,
  jsdoc.configs["flat/recommended"],
  unicorn.configs["flat/recommended"],
  {
    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    },
  },
  prettier,
];
