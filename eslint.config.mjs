import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals"),
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [...tseslint.configs.strictTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // §2.1 — no console.log in committed code; lib/debug.ts is the sanctioned surface.
      "no-console": "error",
    },
  },
  prettier,
);
