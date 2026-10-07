import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    plugins: { prettier: prettierPlugin },
    rules: {
      indent: ["error", 2, { SwitchCase: 1 }],
      "@typescript-eslint/indent": "off",
      "@typescript-eslint/no-explicit-any": "warn",
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
          endOfLine: "auto",
        },
      ],
    },
  },

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
