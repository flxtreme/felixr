import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Prettier plugin setup
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Indentation: 2 spaces
      indent: ["error", 2, { SwitchCase: 1 }],
      "@typescript-eslint/indent": "off", // let Prettier handle it
      "@typescript-eslint/no-explicit-any": "warn",
      // Prettier formatting as errors
      "prettier/prettier": [
        "error",
        {
          tabWidth: 2,
          useTabs: false,
          semi: true,
          singleQuote: false,
          jsxSingleQuote: false,
          trailingComma: "es5",
          printWidth: 100,
          bracketSpacing: true,
          bracketSameLine: false,
          arrowParens: "always",
          endOfLine: "lf",
        },
      ],
    },
  },

  // Disable ESLint rules that conflict with Prettier
  prettierConfig,

  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "dist/**",
    "coverage/**",
  ]),
]);

export default eslintConfig;
