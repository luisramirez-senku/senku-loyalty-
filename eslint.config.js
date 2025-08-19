
import preset from "@repo/eslint-config/next.js";

export default [
  ...preset,
  {
    ignores: ["functions/*"],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "prefer-const": "warn"
    }
  }
];
